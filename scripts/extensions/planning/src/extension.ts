import {IExtension, IArticle, ISuperdesk, onPublishMiddlewareResult} from 'superdesk-api';
import {IPlanningAssignmentService} from './interfaces';

import ng from 'superdesk-core/scripts/core/services/ng';

function onSpike(superdesk: ISuperdesk, item: IArticle) {
    const {gettext} = superdesk.localization;

    if (item.assignment_id != null) {
        return Promise.resolve({
            warnings: [
                {
                    text: gettext('This item is linked to in-progress planning coverage.'),
                },
            ],
        });
    } else {
        return Promise.resolve({});
    }
}

function onSpikeMultiple(superdesk: ISuperdesk, items: Array<IArticle>) {
    const {gettext} = superdesk.localization;
    const itemsWithAssignmentsExist = items.some((item) => item.assignment_id != null);

    if (itemsWithAssignmentsExist) {
        return Promise.resolve({
            warnings: [
                {
                    text: gettext('Some items are linked to in-progress planning coverage.'),
                },
            ],
        });
    } else {
        return Promise.resolve({});
    }
}

function onPublishArticle(superdesk: ISuperdesk, item: IArticle): Promise<onPublishMiddlewareResult> {
    if (!superdesk ||
        !superdesk.instance ||
        !superdesk.instance.deployConfig ||
        !superdesk.instance.deployConfig.config ||
        !superdesk.instance.deployConfig.config.planning_check_for_assignment_on_publish
    ) {
        return Promise.resolve({});
    }

    const assignmentService: IPlanningAssignmentService = ng.get('assignments');

    return assignmentService.onPublishFromAuthoring(item);
}

function onArticleRewriteAfter(superdesk: ISuperdesk, item: IArticle): Promise<IArticle> {
    if (!superdesk ||
        !superdesk.instance ||
        !superdesk.instance.deployConfig ||
        !superdesk.instance.deployConfig.config ||
        !superdesk.instance.deployConfig.config.planning_link_updates_to_coverage
    ) {
        return Promise.resolve(item);
    }

    const assignmentService: IPlanningAssignmentService = ng.get('assignments');

    return assignmentService.onArchiveRewrite(item);
}

const extension: IExtension = {
    activate: (superdesk: ISuperdesk) => {
        return Promise.resolve({
            contributions: {
                entities: {
                    article: {
                        onSpike: (item: IArticle) => onSpike(superdesk, item),
                        onSpikeMultiple: (items: Array<IArticle>) => onSpikeMultiple(superdesk, items),
                        onPublish: (item: IArticle) => onPublishArticle(superdesk, item),
                        onRewriteAfter: (item: IArticle) => onArticleRewriteAfter(superdesk, item),
                    },
                },
            },
        });
    },
};

export default extension;
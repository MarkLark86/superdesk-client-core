// External Modules
import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

// Types
import {ISetItem, IStorageDestinationItem, SET_STATE} from '../../interfaces';
import {IApplicationState} from '../../store';

// Redux Actions & Selectors
import {editSet, confirmBeforeDeletingSet, closeSetContentPanel} from '../../store/sets/actions';
import {getSelectedSet, getSelectedSetStorageDestination} from '../../store/sets/selectors';

// UI
import {FormLabel} from 'superdesk-ui-framework/react';
import {PanelContent, PanelContentBlock, PanelContentBlockInner, PanelHeader, PanelTools, Text} from '../../ui';
import {IPanelTools} from '../../ui/PanelTools';
import {superdeskApi} from '../../apis';

interface IProps {
    set?: ISetItem;
    storageDestination?: IStorageDestinationItem;
    onEdit(set: ISetItem): void;
    onDelete(set: ISetItem): void;
    onClose(): void;
}

const mapStateToProps = (state: IApplicationState) => ({
    set: getSelectedSet(state),
    storageDestination: getSelectedSetStorageDestination(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onEdit: (set: ISetItem) => dispatch(editSet(set._id)),
    onDelete: (set: ISetItem) => dispatch<any>(confirmBeforeDeletingSet(set)),
    onClose: () => dispatch(closeSetContentPanel()),
});

class SetPreviewPanelComponent extends React.PureComponent<IProps> {
    render() {
        const {gettext} = superdeskApi.localization;
        const {set, storageDestination} = this.props;

        if (set?._id == null) {
            return null;
        }

        let topTools: Array<IPanelTools> = [{
            title: gettext('Edit'),
            icon: 'pencil',
            onClick: () => this.props.onEdit(set),
            ariaValue: 'edit',
        }, {
            title: gettext('Close'),
            icon: 'close-small',
            onClick: this.props.onClose,
            ariaValue: 'close',
        }];

        if (set.state === SET_STATE.DRAFT) {
            topTools = [
                {
                    title: gettext('Delete'),
                    icon: 'trash',
                    onClick: () => this.props.onDelete(set),
                    ariaValue: 'delete',
                },
                ...topTools,
            ];
        }

        return (
            <React.Fragment>
                <PanelHeader borderB={true} title={gettext('Set Details')}>
                    <PanelTools tools={topTools} />
                </PanelHeader>
                <PanelContent>
                    <PanelContentBlock flex={true}>
                        <PanelContentBlockInner grow={true}>
                            <FormLabel text={gettext('Name')} style="light" />
                            <Text>{set.name}</Text>

                            <FormLabel text={gettext('Description')} style="light" />
                            <Text>{set.description}</Text>

                            <FormLabel text={gettext('Storage Destination')} style="light" />
                            <Text>{storageDestination?._id}</Text>

                            <FormLabel text={gettext('Storage Provider')} style="light" />
                            <Text>{storageDestination?.provider}</Text>
                        </PanelContentBlockInner>
                    </PanelContentBlock>
                </PanelContent>
            </React.Fragment>
        );
    }
}

export const SetPreviewPanel = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SetPreviewPanelComponent);

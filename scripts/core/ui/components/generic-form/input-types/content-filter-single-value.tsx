import {getSelectSingleValue} from './select_single_value';
import {IRestApiResponse} from 'types/RestApi';
import {IContentFilter} from 'superdesk-interfaces/ContentFilter';
import ng from 'core/services/ng';

export const ContentFilterSingleValue = getSelectSingleValue(
    () =>
        ng.getService('api')
            .then((api) => api('content_filters').query({max_results: 1000, sort: '[(\'name\', 1)]'}))
            .then((contentFilters: IRestApiResponse<IContentFilter>) =>
                contentFilters._items.map(({_id, name}) => ({id: _id, label: name}))),
);

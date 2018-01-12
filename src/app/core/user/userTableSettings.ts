import { PagingSettings } from '../../common/paging/paging.settings';
import { UserFilter } from './userFilter';

export class UserTableSettings implements PagingSettings {
    constructor(
        public totalCount: number,
        public currentPage: number,
        public itemsPerPage: number,

        public searchKeyword: string,

        public userFilter: UserFilter) {
    }
}
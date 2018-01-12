import { PagingSettings } from '../../common/paging/paging.settings';

export class DepartmentTableSettings implements PagingSettings {
    constructor(
        public totalCount: number,
        public currentPage: number,
        public itemsPerPage: number,

        public searchKeyword: string) {
    }
}
export class PagingSettings {
    constructor(
        public totalCount: number,
        public currentPage: number,
        public itemsPerPage: number) {
    }
}
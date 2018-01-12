export class GridSettings {
    constructor(public totalCount: number,
        public currentPage: number,
        public itemsPerPage: number,
        public sortColumnName: string,
        public isDescending: boolean) {
    }
}
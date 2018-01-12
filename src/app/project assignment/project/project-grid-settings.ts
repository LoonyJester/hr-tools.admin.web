import { GridSettings } from '../../common/grid/gridSettings';

export class ProjectGridSettings implements GridSettings {
    public showOld: boolean;
    public showDeactivated: boolean;

    constructor(public totalCount: number,
        public currentPage: number,
        public itemsPerPage: number,
        public sortColumnName: string,
        public isDescending: boolean,

        public searchKeyword: string) {
        this.showOld = false;
        this.showDeactivated = false;
    }
}
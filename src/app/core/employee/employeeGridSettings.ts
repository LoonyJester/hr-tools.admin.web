import { GridSettings } from '../../common/grid/gridSettings';
import { EmployeesFilter } from './employeesFilter';

export class EmployeeGridSettings implements GridSettings{
    constructor(public totalCount: number,
        public currentPage: number, 
        public itemsPerPage: number, 
        public sortColumnName: string,
        public isDescending: boolean,
        
        public searchKeyword: string,
        
        public employeeFilter: EmployeesFilter){
    }
}
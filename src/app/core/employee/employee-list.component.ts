import { Component, ViewChild } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { AddEditEmployeeModalComponent } from './modals/addEdit/addEditEmployeeModal.component';
import { Employee } from "./employee";
import { EmployeeGridItem } from "./employeeGridItem";
import { AlertType } from "../../common/alerts/alertType";
import { EmployeesFilter } from './employeesFilter';
import { Status } from '../common/status.enum';
import { City } from '../company/officeLocation';
import { EmployeeGridSettings } from './employeeGridSettings';
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'employeeList',
    templateUrl: 'employee-list.template.html',
    providers: [EmployeeService, EmployeesFilter]
})

export class EmployeeListComponent {
    public employees: Array<EmployeeGridItem>;
    public columns: Array<any>;
    public gridSettings: EmployeeGridSettings;
    public activeModulesConfiguration: Array<string>;

    private isLoading: boolean = true;
    public alerts: Array<any> = [];
    private officeLocations: Array<any>;
    private cities: Array<string>;
    private filters: EmployeesFilter = new EmployeesFilter();

    @ViewChild(DeleteConfirmationModalComponent) confirmDeleteModal: DeleteConfirmationModalComponent
    @ViewChild(AddEditEmployeeModalComponent) addEditEmployeeModal: AddEditEmployeeModalComponent

    constructor(private _employeeService: EmployeeService,
        private _authService: AuthService) {
        //this.resetFilters();
        this.gridSettings = new EmployeeGridSettings(0, 1, 15, 'FullName', false, '', this.filters);
        this.employees = this.getAll(this.gridSettings);
        this.columns = this.getColumns();

        this.initFilters();

        this.activeModulesConfiguration = this.getActiveModulesConfiguration();
    }

    private getColumns(): Array<any> {
        return [
            { title: 'Full Name', name: 'fullName', className: ["width30Perc"] },
            { title: 'Job Title', name: 'jobTitle', className: ["width20Perc"] },
            { title: 'Technology', name: 'technology', className: ["width10Perc"] },
            { title: 'Project Name', name: 'projectName', className: ["width15Perc"] },
            { title: 'Department Name', name: 'departmentName', className: ["width15Perc"] },
            { title: 'Edit', name: 'edit', className: "width5Perc", sort: false },
            { title: 'Delete', name: '_delete', className: "width5Perc", sort: false }
        ];
    }

    private initFilters(): void {
        this._employeeService.getCountriesWithCities()
            .subscribe(response => {
                this.officeLocations = response;
                this.resetFilters();
                this.isLoading = false;
            }
            , error => this.handleError(error));
    }

    private resetFilters(): void {
        this.filters.officeLocations = new Array();
        this.officeLocations.map(loc => {
            this.filters.officeLocations.push({
                Country: loc.Country,
                Cities: loc.Cities
            });
        });

        this.filters.country = this.filters.allCountriesText;
        this.filters.city = this.filters.allCitiesText;
        this.filters.status = this.filters.statusList[0].id;

        this.filters.officeLocations.push({
            Country: this.filters.allCountriesText,
            Cities: [this.filters.allCitiesText]
        });

        this.initCities(this.filters.country);
    }

    private initCities(country: string): Array<string> {
        let cities: Array<string> = new Array<string>();

        this.cities = cities;
        if (!country) {
            return;
        } else if (country == this.filters.allCountriesText) {
            this.cities.push(this.filters.allCitiesText);
            this.filters.city = this.filters.allCitiesText;

            return cities;
        }

        let selectedCountry = country;
        this.officeLocations.map(loc => {
            if (loc.Country == selectedCountry) {
                cities.push(this.filters.allCitiesText);
                Array.prototype.push.apply(cities, (loc.Cities));
            }
        });

        this.cities = cities;
    }

    private getActiveModulesConfiguration(): Array<string>{
        let result: Array<string>;

        this._employeeService.getActiveModulesConfiguration()
            .subscribe(response => {
                result = response;
            }
            , error => this.handleError(error));

        return result;
    }

    public add(): void {
        this.addEditEmployeeModal.showChildModal("Add", this.officeLocations, new Employee());
    }

    public search(searchKeyword: string, filters: EmployeesFilter): void {
        this.gridSettings.searchKeyword = searchKeyword;
        this.gridSettings.employeeFilter = filters;

        this.getAll(this.gridSettings);
    }  

    public onCellClicked(event): void {
        if (event.column == "edit") {
            this._edit(event.row);
        } else if (event.column == "_delete") {
            this._delete(event.row)
        }
    }

    private _edit(row: EmployeeGridItem): void {
        let rowCopy = <Employee>JSON.parse(JSON.stringify(row));

        this.addEditEmployeeModal.showChildModal("Edit", this.officeLocations, rowCopy);
    }

    private _delete(row: EmployeeGridItem): void {
        this.confirmDeleteModal.show(row);
    }

    public onGridStateChanged(event): void {
        this.gridSettings.currentPage = event.currentPage;
        this.gridSettings.sortColumnName = event.sortColumnName;
        this.gridSettings.isDescending = event.isDescending;

        this.getAll(this.gridSettings);
    }    

    public onEmployeeSaved(employee: Employee): void {
        this.isLoading = true;

        if (employee.id) {
            this.update(employee);
        } else {
            this.create(employee);
        }
    }    

    private create(employee: Employee): boolean {
        let wasCreated: boolean = false;

        this._employeeService.create(employee)
            .subscribe(
            response => {
                wasCreated = response;

                if (wasCreated) {
                    //this.assignUserToEmployee(employee.companyEmail);

                    this.getAll(this.gridSettings);
                    this.showResult(wasCreated, "Employee was successfully created", AlertType.Success);
                } else {
                    this.showResult(wasCreated, "Employee was not created", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        return wasCreated;
    }

    private update(employee: Employee): void {
        let wasUpdated;

        this._employeeService.update(employee)
            .subscribe(
            response => {
                debugger;
                wasUpdated = response;

                if (wasUpdated) {
                    //this.assignUserToEmployee(employee.companyEmail);

                    this.getAll(this.gridSettings);
                    this.showResult(wasUpdated, "Employee was successfully updated", AlertType.Success);
                } else {
                    this.showResult(wasUpdated, "Employee was not upated", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );
    }

    private assignUserToEmployee(login: string): void {
        this._employeeService.getUserIdByLogin(login)
            .subscribe(
            userId => {
                debugger;
                if (!userId) {
                    return;
                }

                this._employeeService.assignUserToEmployee(userId, login)
                    .subscribe(
                    wasAssigned => {
                        debugger;
                        // if (wasAssigned) {
                        //     this.showResult(true, "User was successfully assigned to an employee with same company email", "success", true);                    
                        // } else {
                        //     this.showResult(false, "User was not assigned to an employee with same company email", "error", false);
                        // }
                        // this.user = this.copyObject(this.currentUser);
                    },
                    error => {
                        //this.showResult(false, "error", "error");
                        console.log(error);
                    }
                    );
            },
            error => {
                //this.showResult(false, "error", "error");
                console.log(error);
            }
            );

    }

    public onDelete(row: EmployeeGridItem): boolean {
        let wasDeleted;

        this._employeeService.delete(row.id)
            .subscribe(
            response => {
                wasDeleted = response;

                if (wasDeleted) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasDeleted, "Employee was successfully deleted", AlertType.Success);
                } else {
                    this.showResult(wasDeleted, "Employee was not deleted", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        this.getAll(this.gridSettings);

        return wasDeleted;
    }

    private getAll(gridSettings: EmployeeGridSettings): Array<EmployeeGridItem> {
        this._employeeService.getAll(gridSettings)
            .subscribe(response => {
                this.employees = response.data.map(this.mapEmployeeToEmployeeGridItem);
                this.gridSettings.totalCount = response.totalCount;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.employees;
    }

    private mapEmployeeToEmployeeGridItem(employee: Employee): EmployeeGridItem {
        let result: EmployeeGridItem = new EmployeeGridItem(employee);

        result.edit = '<i class="fa fa-pencil-square-o"></i>';
        result._delete = '<i class="fa fa-times"></i>';

        return result;
    }    

    private handleError(error): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody = JSON.parse(error._body);
            if(errorBody.Message){
                errorMessage = errorBody.Message;
            }else{
                errorMessage = errorBody;
            }  
        }

        if (error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.isLoading = false;
        this.showResult(false, errorMessage, AlertType.Error);
        console.log(error);
    }

    private showResult(wasOperationSucceed, message, type: string): void {
        this.alerts.push({
            type: type,
            msg: message,
            timeout: 4000
        });
    }
}
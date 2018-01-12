import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../employee';
import { City } from '../../company/officeLocation';
import { Status } from '../../common/status.enum';
import { Technology } from '../../common/technology.enum';
import { EmployeesFilter } from '../employeesFilter';
import { GridData } from '../../common/gridData';
import { EmployeeGridSettings } from '../employeeGridSettings';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class EmployeeService {
    private apiUrl: string;
    private auhtApiUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
        this.auhtApiUrl = this._urlHelper.getAuthUrl(host);
    }

    getAll(gridSettings: EmployeeGridSettings): Observable<GridData<Employee>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        params.set('gridSettings',
            JSON.stringify({
                PagingSettings: {
                    CurrentPage: gridSettings.currentPage,
                    ItemsPerPage: gridSettings.itemsPerPage
                },
                SortingSettings: {
                    SortColumnName: gridSettings.sortColumnName,
                    IsDescending: gridSettings.isDescending
                },
                SearchKeyword: gridSettings.searchKeyword,
                EmployeeFilter: gridSettings.employeeFilter.isEmpty() ? {} : {
                    Country: gridSettings.employeeFilter.country == gridSettings.employeeFilter.allCountriesText ? "" : gridSettings.employeeFilter.country,
                    City: gridSettings.employeeFilter.city == gridSettings.employeeFilter.allCitiesText ? "" : gridSettings.employeeFilter.city,
                    Status: gridSettings.employeeFilter.status
                }
            }));

        return this._http.get(this.apiUrl + 'Api/GetAllEmployees', {
            search: params,
            headers
        }).map(res => {
            let result: GridData<Employee> = new GridData<Employee>();
            let jsonRes: any = res.json();

            result.data = jsonRes.Data.map(this.mapBEToEmployee);
            result.totalCount = jsonRes.TotalCount;

            return result;
        });
    }

    getCountriesWithCities(): Observable<any> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.apiUrl + 'Api/GetCountriesWithCities', {
            headers
        }).map(res =>
            res.json().map(this.mapBEToOfficeLocationList)
            );
    }

    private mapBEToOfficeLocationList(officeLocationList: any): any {
        return officeLocationList;
    }

    create(employee: Employee): Observable<boolean> {
        let beModel: any = this.mapEmployeeToBE(employee);
        let headers: Headers = this._authService.getHeaders();
        const body: string = JSON.stringify(beModel);
        
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateEmployee', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(employee: Employee): Observable<boolean> {
        let beModel: any = this.mapEmployeeToBE(employee);        
        let headers: Headers = this._authService.getHeaders();
        const body: string = JSON.stringify(beModel);

        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateEmployee', body, {
            headers: headers
        }).map(res => res.json());
    }

    delete(id: string): Observable<boolean> {
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.delete(this.apiUrl + 'Api/DeleteEmployee', {
            headers: headers,
            body: JSON.stringify(id)
        }).map(res => res.json());
    }

    deleteBio(fileName: string, employeeId: string, employeeIdForFiles: string): Observable<boolean> {
        let params: string = JSON.stringify({
            FileName: fileName,
            EmployeeId: employeeId,
            EmployeeIdForFiles: employeeIdForFiles
        });

        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.delete(this.apiUrl + 'Api/DeleteBio', {
            headers: headers,
            body: params
        }).map(res => res.json());
    }

    deletePhoto(fileName: string, employeeId: string, employeeIdForFiles: string): Observable<boolean> {
        let params: string = JSON.stringify({
            FileName: fileName,
            EmployeeId: employeeId,
            EmployeeIdForFiles: employeeIdForFiles
        });

        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/DeletePhoto', {
            headers: headers,
            body: params
        }).map(res => res.json());
    }

    getUserIdByLogin(login: string): Observable<string> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        params.set('login', login);

        return this._http.get(this.auhtApiUrl + 'Api/GetByLogin?login=' + login, {
            headers
        }).map(res => {
            return res.json().UserId;
        });
    }

    assignUserToEmployee(userId: string, login: string): Observable<boolean> {
        let beModel: any = {
            UserId: userId,
            Login: login
        };
        const body: string = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/AssignUserToEmployee', body, {
            headers: headers
        }).map(res => res.json());
    }

    public getActiveModulesConfiguration(): Observable<Array<string>>{
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.apiUrl + 'Api/GetActiveModules', {
            headers
        }).map(res => {
            return res.json();
        });
    }

    private mapBEToEmployee(employee: any): Employee {
        let result: Employee = new Employee();

        result.id = employee.EmployeeId;
        result.fullName = employee.FullName;
        result.fullNameCyrillic = employee.FullNameCyrillic;
        result.patronymicCyrillic = employee.PatronymicCyrillic;
        result.jobTitle = employee.JobTitle;
        result.departmentName = employee.DepartmentName;

        // let enumValue = Technology[employee.Technology];
        // let enumDescription = TechnologyDescriptions[enumValue];
        result.technology = employee.Technology;
        result.projectName = employee.ProjectName;

        result.companyEmail = employee.CompanyEmail;
        result.personalEmail = employee.PersonalEmail;

        result.messengerName = employee.Messenger.Name;
        result.messengerLogin = employee.Messenger.Login;

        result.mobileNumber = employee.MobileNumber;
        result.additionalMobileNumber = employee.AdditionalMobileNumber;
        result.birthday = employee.Birthday;

        //let enumValue = Status[employee.Status];
        result.status = employee.Status;

        result.startDate = employee.StartDate;
        result.terminationDate = employee.TerminationDate;
        result.daysSkipped = employee.DaysSkipped;
        result.bioUrl = employee.BioUrl;
        result.notes = employee.Notes;

        result.country = employee.OfficeLocation.Country;
        result.city = employee.OfficeLocation.City;

        return result;
    }

    private mapEmployeeToBE(employee: Employee): any {
        let result: any = {};

        result.EmployeeId = employee.id;
        result.FullName = employee.fullName;
        result.FullNameCyrillic = employee.fullNameCyrillic;
        result.PatronymicCyrillic = employee.patronymicCyrillic;
        result.JobTitle = employee.jobTitle;
        result.DepartmentName = employee.departmentName;
        result.Technology = employee.technology;
        result.ProjectName = employee.projectName;
        result.CompanyEmail = employee.companyEmail;
        result.PersonalEmail = employee.personalEmail;
        result.Messenger = {
            Name: employee.messengerName,
            Login: employee.messengerLogin
        };
        result.MobileNumber = employee.mobileNumber;
        result.AdditionalMobileNumber = employee.additionalMobileNumber;
        result.Birthday = employee.birthday;
        result.Status = employee.status;
        result.StartDate = employee.startDate;
        result.TerminationDate = employee.terminationDate;
        result.DaysSkipped = employee.daysSkipped;
        result.BioUrl = employee.bioUrl;
        result.Notes = employee.notes;
        result.Photo = employee.photo;

        result.OfficeLocation = {
            Country: employee.country,
            City: employee.city
        }

        result.EmployeeIdForFiles = employee.employeeIdForFiles;

        return result;
    }
}
import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Department } from '../../common/department';
import { DepartmentTableSettings } from '../department-table-settings';
import { GridData } from '../../common/gridData';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class DepartmentService {
    private apiUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {

        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    getAll(searchKeyword: string): Observable<Array<Department>> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.apiUrl + 'Api/GetAllDepartments?searchKeyword=' + searchKeyword, {
            headers: headers
        }).map(res => {
            let result = new Array<Department>();
            let jsonRes = res.json();

            result = jsonRes.map(this.mapBEToDepartment);

            return result;
        });
    }

    private mapBEToDepartment(department: any): Department {
        let result = new Department();

        result.id = department.Id;
        result.name = department.Name;
        result.description = department.Description;

        return result;
    }

    getAccessToken(): string {
        return "Bearer " + this._authService.getAccessToken();
    }

    create(department: Department): Observable<boolean> {
        let beModel = this.mapDepartmentToBE(department);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateDepartment', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(department: Department): Observable<boolean> {
        let beModel = this.mapDepartmentToBE(department);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateDepartment', body, {
            headers: headers,
        }).map(res => res.json());
    }

    delete(id: number): Observable<boolean> {
        const params: string = JSON.stringify(id);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.delete(this.apiUrl + 'Api/DeleteDepartment', {
            headers: headers,
            body: id
        }).map(res => res.json());
    }

    private mapDepartmentToBE(project: Department): any {
        let result: any = {};

        result.Id = project.id;
        result.Name = project.name;
        result.Description = project.description;

        return result;
    }
}
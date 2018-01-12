import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Project } from '../../common/project';
import { ProjectGridSettings } from '../project-grid-settings';
import { GridData } from '../../common/gridData';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class ProjectService {
    private apiUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {

        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    getAll(gridSettings: ProjectGridSettings): Observable<GridData<Project>> {
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
                ShowOld: gridSettings.showOld,
                ShowDeactivated: gridSettings.showDeactivated
            }));

        return this._http.get(this.apiUrl + 'Api/GetAllProjects', {
            search: params,
            headers
        }).map(res => {
            let result = new GridData<Project>();
            let jsonRes = res.json();

            result.data = jsonRes.Data.map(this.mapBEToProject);
            result.totalCount = jsonRes.TotalCount;

            return result;
        });
    }

    create(project: Project): Observable<boolean> {
        let beModel = this.mapProjectToBE(project);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateProject', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(project: Project): Observable<boolean> {
        let beModel = this.mapProjectToBE(project);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateProject', body, {
            headers: headers
        }).map(res => res.json());
    }

    delete(id: number): Observable<boolean> {
        const params = JSON.stringify(id);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.delete(this.apiUrl + 'Api/DeleteProject', {
            headers: headers,
            body: id
        }).map(res => res.json());
    }

    activate(id: number, makeActive: boolean): Observable<boolean> {
        const params = JSON.stringify({
            id: id,
            makeActive: makeActive
        });
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.put(this.apiUrl + 'Api/ActivateProject', params, {
            headers: headers
        }).map(res => res.json());
    }

    private mapBEToProject(project: any): Project {
        let result = new Project();

        result.id = project.Id;
        result.name = project.Name;
        result.description = project.Description;
        result.startDate = project.StartDate;
        result.endDate = project.EndDate;
        result.isActive = project.IsActive;

        return result;
    }

    private mapProjectToBE(project: Project): any {
        let result: any = {};

        result.Id = project.id;
        result.Name = project.name;
        result.Description = project.description;
        result.StartDate = project.startDate;
        result.EndDate = project.endDate;
        result.IsActive = project.isActive;

        return result;
    }
}
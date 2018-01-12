import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { JobTitle } from '../job-title';
import { GridData } from '../../common/gridData';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class JobTitleService {
    private apiUrl;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    getAll(): Observable<Array<JobTitle>> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.apiUrl + 'Api/GetAllJobTitles', {
            headers: headers
        }).map(res => {
            let result = new Array<JobTitle>();
            let jsonRes = res.json();

            result = jsonRes.map(this.mapBEToJobTitle);

            return result;
        });
    }

    private mapBEToJobTitle(jobTitle: any): JobTitle {
        let result = new JobTitle();

        result.Id = jobTitle.Id;
        result.Name = jobTitle.Name;

        return result;
    }

    getAccessToken(): string {
        return "Bearer " + this._authService.getAccessToken();
    }

    create(jobTitle: JobTitle): Observable<boolean> {
        let beModel: any = this.mapJobTitleToBE(jobTitle);
        const body: string = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateJobTitle', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(JobTitle: JobTitle): Observable<boolean> {
        let beModel: any = this.mapJobTitleToBE(JobTitle);
        const body: string = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateJobTitle', body, {
            headers: headers
        }).map(res => res.json());
    }

    delete(id: number): Observable<boolean> {
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.delete(this.apiUrl + 'Api/DeleteJobTitle', {
            headers: headers,
            body: id
        }).map(res => res.json());
    }    

    private mapJobTitleToBE(jobTitle: JobTitle): any {
        let result: any = {};

        result.Id = jobTitle.Id;
        result.Name = jobTitle.Name;

        return result;
    }
}
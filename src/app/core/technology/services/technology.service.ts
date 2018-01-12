import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Technology } from '../technology';
import { GridData } from '../../common/gridData';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class TechnologyService {
    private apiUrl;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    getAll(): Observable<Array<Technology>> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.apiUrl + 'Api/GetAllTechnologies', {
            headers: headers
        }).map(res => {
            let result = new Array<Technology>();
            let jsonRes = res.json();

            result = jsonRes.map(this.mapBEToTechnology);

            return result;
        });
    }

    getAccessToken(): string {
        return "Bearer " + this._authService.getAccessToken();
    }

    create(technology: Technology): Observable<boolean> {
        let beModel = this.mapTechnologyToBE(technology);        
        let headers: Headers = this._authService.getHeaders();
        const body = JSON.stringify(beModel);

        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateTechnology', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(technology: Technology): Observable<boolean> {
        let beModel = this.mapTechnologyToBE(technology);
        let headers: Headers = this._authService.getHeaders();
        const body = JSON.stringify(beModel);
        
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateTechnology', body, {
            headers: headers
        }).map(res => res.json());
    }

    delete(id: number): Observable<boolean> {
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.delete(this.apiUrl + 'Api/DeleteTechnology', {
            headers: headers,
            body: id
        }).map(res => res.json());
    }

    private mapBEToTechnology(technology: any): Technology {
        let result = new Technology();

        result.Id = technology.Id;
        result.Name = technology.Name;

        return result;
    }

    private mapTechnologyToBE(technology: Technology): any {
        let result: any = {};

        result.Id = technology.Id;
        result.Name = technology.Name;

        return result;
    }
}
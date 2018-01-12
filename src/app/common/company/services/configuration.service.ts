import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class ConfigurationService {
    private apiUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    public getActiveModulesConfiguration(): Observable<Array<string>>{
        let headers: Headers = this._authService.getHeaders();
        
        return this._http.get(this.apiUrl + 'Api/GetActiveModules', {
            headers
        }).map(res => {
            return res.json();
        });
    }
}
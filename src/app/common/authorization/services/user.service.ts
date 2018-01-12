import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../user';
import { AuthService } from './auth.service';
import { UrlHelper } from "../../company/urlHelper";

@Injectable()
export class UserService {
    private user: User = new User();
    private authorizationServerUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.authorizationServerUrl = this._urlHelper.getAuthUrl(host);
    }

    public getUserDetails(): Observable<User> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.authorizationServerUrl + 'core/connect/userinfo', {
            headers: headers
        }).map(res => {
            let jsonRes = res.json();
            if (!this.user) {
                this.user = new User();
            }

            this.user.name = jsonRes.name;
            this.user.roles = jsonRes.role;

            return this.user;
        });
    }    

    private isEmpty(user: User): boolean {
        return user == null || typeof (user.name) == 'undefined' || typeof (user.roles) == 'undefined';
    }

    private getUserFromLocalStorage(): User {
        let userInfo: string = localStorage.getItem("userInfo");

        return JSON.parse(userInfo);
    }

    public validateAccessToken(accessToken: string): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();
        params.set('token', accessToken);

        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        // return this._http.get(this.authorizationServerUrl + '/connect/accesstokenvalidation', {
        //     search: params,
        //     headers
        // }).map(res => res.json());
        return null;
        // return this._http.get(this.authorizationServerUrl + '/connect/accesstokenvalidation?token=' + accessToken)
        //     .map(res => res.json());
    }    
}
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UrlHelper } from "../../company/urlHelper";
import { UserLoginData } from '../login/userLoginData';
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
    private authorizationServerUrl: string;
    private clientName = "ngAuthApp";

    private isAuth: boolean;
    private email: string;
    private useRefreshTokens: any

    constructor(private _http: Http,
        private _urlHelper: UrlHelper,
        private router: Router,
        private _location: Location) {
        let host: string = location.hostname;
        this.authorizationServerUrl = this._urlHelper.getAuthUrl(host);
    }

    public login(userLoginData: UserLoginData): Observable<any> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let data = "grant_type=password&username=" + userLoginData.Email + "&password=" + userLoginData.Password;

        if (userLoginData.UseRefreshTokens) {
            data = data + "&client_id=" + this.clientName;
        }

        return this._http.post(this.authorizationServerUrl + 'token', data, {
            headers
        }).map(res => res.json());
    }

    public setAuthData(isAuth: boolean, email: string, useRefreshTokens: any) {
        this.isAuth = isAuth;
        this.email = email;
        this.useRefreshTokens = useRefreshTokens;
    }

    public isUserLoggedIn(): boolean {
        let authDataSerialized = localStorage.getItem("authorizationData");
        if (!authDataSerialized) {
            return false;
        }

        let authData = JSON.parse(authDataSerialized);

        return !!authData.token;// && new Date(authData.expiresAt) > new Date();
    }

    public isUserInRole(roles: Array<string>): boolean {
        let userRoles = localStorage.getItem("roles");
        if (!userRoles) {
            return false;
        }

        for (let role of roles) {
            if (!userRoles.includes(role)) {
                return false;
            }
        }

        return true;
    }

    public redirectToLoginPage(): void {
        location.href = "/";
       // this.router.navigateByUrl('');
    }

    public getHeaders(): Headers {
        let authDataSerialized = localStorage.getItem("authorizationData");
        if (!authDataSerialized) {
            this.logout();
            return new Headers();
        }

        let authData = JSON.parse(authDataSerialized);
        if (!authData || !authData.token) {
            this.logout();
            return new Headers();
        }

        return new Headers({
            "Authorization": "Bearer " + authData.token
        });
    }

    public getAccessToken(): string {
        let authDataSerialized = localStorage.getItem("authorizationData");
        if (!authDataSerialized) {
            //todo: redirect to login page
            return;
        }

        let authData = JSON.parse(authDataSerialized);
        if (!authData || !authData.token) {
            //todo: redirect to login page
            return;
        }

        return authData.token;
    }

    public logout() {
        localStorage.removeItem("authorizationData");
        //location.href = "http://teaminternational.admin:3000";
        //this.redirectToLoginPage();
    }

    public canTokenBeRefreshed(): boolean {
        let authDataSerialized = localStorage.getItem("authorizationData");
        if (!authDataSerialized) {
            return false;
        }

        let authData = JSON.parse(authDataSerialized);
        if (!authData || !authData.refreshToken || !authData.useRefreshTokens) {
            return false;
        }

        return true;
    }

    public refreshToken(): Observable<any> {
        let authDataSerialized = localStorage.getItem("authorizationData");
        if (!authDataSerialized) {
            return;
        }

        let authData = JSON.parse(authDataSerialized);
        if (!authData || !authData.token || !authData.useRefreshTokens) {
            return;
        }

        let data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + this.clientName;

        this.refresh(data)
            .subscribe(response => {
                localStorage.removeItem('authorizationData');

                localStorage.setItem('authorizationData', JSON.stringify(
                    {
                        token: response.access_token,
                        userName: response.userName,
                        refreshToken: response.refresh_token,
                        useRefreshTokens: true
                    }));

                location.reload();
            }
            , error => {
                this.logout();
            });
    }

    private refresh(data): Observable<any> {
        let headers: Headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        return this._http.post(this.authorizationServerUrl + 'token', data, {
            headers
        }).map(res => res.json());
    }

    public handleUnauhorizedError(): void {
        if (this.canTokenBeRefreshed()) {
            this.refreshToken();
        } else {
            localStorage.removeItem("authorizationData");
            location.href = "/";   
        }
    }
}
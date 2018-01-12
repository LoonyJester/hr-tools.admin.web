import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../user';
import { Role } from '../../../common/authorization/role';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { UserTableSettings } from '../userTableSettings';
import { UserActivationStatus } from '../enums/UserActivationStatus';
import { GridData } from '../../common/gridData';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class UserService {
    private adminApiUrl: string;
    private authApiUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.adminApiUrl = _urlHelper.getApiUrl(host);
        this.authApiUrl = _urlHelper.getAuthUrl(host);
    }

    getAll(userTableSettings: UserTableSettings): Observable<GridData<User>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        params.set('tableSettings',
            JSON.stringify({
                PagingSettings: {
                    CurrentPage: userTableSettings.currentPage,
                    ItemsPerPage: userTableSettings.itemsPerPage
                },
                SearchKeyword: userTableSettings.searchKeyword,
                UserFilter: {
                    Roles: userTableSettings.userFilter.selectedRoles == null ? [] : userTableSettings.userFilter.selectedRoles,
                    IsActivated: this.convertToBoolean(userTableSettings.userFilter.isActivated, userTableSettings.userFilter.allActivatedText)
                }
            }
            ));

        return this._http.get(this.authApiUrl + 'Api/GetAllUsers', {
            search: params,
            headers
        }).map(res => {
            let result = new GridData<User>();
            let jsonRes = res.json();

            result.data = jsonRes.Data.map(this.mapBEToUser);
            result.totalCount = jsonRes.TotalCount;

            return result;
        });
    }

    private convertToBoolean(isActivated, defaultText): boolean {
        if (isActivated == UserActivationStatus.Both
            || isActivated == defaultText) {
            return null;
        }
        if (isActivated == UserActivationStatus.Activated) {
            return true;
        }

        return false;
    }

    getAllRoles(): Observable<Array<Role>>{
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.authApiUrl + 'Api/GetAllRoles', {
            headers
        }).map(res => {
            let jsonRes = res.json();
            
            return jsonRes;
        });
    }

    create(user: User): Observable<string> {
        let beModel = this.mapUserToBE(user);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.authApiUrl + 'Api/CreateUser', body, {
            headers: headers
        }).map(res => res.json());
    }

    assignUserToEmployee(userId: string, login: string): Observable<any> {
        let beModel = {
            UserId: userId,
            Login: login
        };
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.adminApiUrl + 'Api/AssignUserToEmployee', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(user: User): Observable<boolean> {
        let beModel = this.mapUserToBE(user);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.authApiUrl + 'Api/UpdateUser', body, {
            headers: headers
        }).map(res => res.json());
    }

    activate(userId: string, activate: boolean): Observable<boolean> {
        const body = JSON.stringify({
            UserId: userId,
            Activate: activate
        });
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.authApiUrl + 'Api/ActivateUser', body, {
            headers: headers
        }).map(res => res.json());
    }

    private mapBEToUser(user): User {
        let result: User = new User();

        result.id = user.UserId;
        result.email = user.Login;
        result.roles = user.Roles;
        result.fullName = user.FullName;
        result.isActivated = user.IsActivated;
        result.assignedEmployeeName = user.AssignedEmployeeName;

        return result;
    }

    private mapUserToBE(user: User) {
        let result: any = {};

        result.UserId = user.id;
        result.Login = user.email;
        result.Roles = user.roles;
        result.FullName = user.fullName;
        result.Password = user.password;
        result.IsActivated = user.isActivated;
        result.AssignedEmployeeName = user.assignedEmployeeName;

        return result;
    }
}
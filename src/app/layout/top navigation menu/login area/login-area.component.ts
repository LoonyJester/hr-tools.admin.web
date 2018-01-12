import { Component, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../../../common/authorization/services/user.service';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { User } from '../../../common/authorization/user';
import { ModuleName } from "../../../common/company/moduleName";
import { ConfigurationService } from '../../../common/company/services/configuration.service';

@Component({
    selector: 'login-area',
    templateUrl: 'login-area.template.html'
    , providers: [UserService, AuthService],
    outputs: ['loginClicked', 'loggedIn']
})

export class LoginAreaComponent {
    public isUserLoggedIn: boolean;
    public loginClicked = new EventEmitter<any>();
    public loggedIn = new EventEmitter<any>();

    private user: User = new User();
    private userName: string;

    constructor(
        private _router: Router,
        private _userService: UserService,
        private _authService: AuthService,
        private _configurationService: ConfigurationService) {
        
        this.isUserLoggedIn = this.isLoggedIn();
        this.userName = this.getUserName();
    }

    private getUserName(): string{
        let authDataSerialized = localStorage.getItem("authorizationData");
        if(!authDataSerialized){
            return "";
        }

        let authData = JSON.parse(authDataSerialized);

        return authData.userNameDisplay;
    }

    private initUserDetails(): User {
        let userInfo: string = localStorage.getItem('userInfo');

        if (userInfo) {
            this.user = JSON.parse(userInfo);

            return this.user;
        } else {
            this._userService.getUserDetails()
                .subscribe(response => {
                    this.user = response;

                    let data: string = JSON.stringify(this.user);
                    localStorage.setItem("userInfo", data);

                    return this.user;
                }
                , error => {
                    debugger;
                });
        }
    }

    public login(state: RouterStateSnapshot): void {
        this.loginClicked.emit();
        //location.replace('/');
        //this._location.replaceState('/');
        //this._router.navigate(['Login']);
    }

    public logoff(): void {
        //this._authService.logout();   
        localStorage.removeItem("authorizationData");
		location.href = "/";     
    }

    public isLoggedIn(): boolean {
        return this._authService.isUserLoggedIn();
    }
}
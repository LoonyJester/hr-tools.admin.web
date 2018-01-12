import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserLoginData } from './userLoginData';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'login',
    templateUrl: 'login.template.html',
    styleUrls: ['login.style.css'],
    providers: [AuthService]
})

export class LoginComponent{
    public user: UserLoginData = new UserLoginData();
    public loginForm: FormGroup;
    public errorMessage: string;

    constructor(private _authService: AuthService){
        this.loginForm = new FormGroup({
            email: new FormControl({ value: this.user.Email }, Validators.required),
            password: new FormControl({ value: this.user.Password }, Validators.required),
            useRefreshTokens: new FormControl({ value: this.user.UseRefreshTokens }),
        });
    }

    public onLoginClicked(){
        let that = this;
        this._authService.login(this.user)
            .subscribe(
            response => {
                if (response) {
                    debugger;
                    if (that.user.UseRefreshTokens) {
                        let data = { 
                            token: response.access_token, 
                            userName: this.user.Email,
                            userNameDisplay: response.userNameDisplay,
                            refreshToken: response.refresh_token, 
                            useRefreshTokens: true,
                            expiresAt: response[".expires"] };

                        localStorage.setItem('authorizationData', JSON.stringify(data));
                    }
                    else {
                        let data = { 
                            token: response.access_token, 
                            userName: response.userName,// this.user.Email, 
                            userNameDisplay: response.userNameDisplay,
                            refreshToken: "", 
                            useRefreshTokens: false,
                            expiresAt: response[".expires"] };

                        localStorage.setItem('authorizationData', JSON.stringify(data));
                    }

                    localStorage.setItem('roles', response.roles);

                    //this._authService.setAuthData(true, this.user.Email, this.user.UseRefreshTokens);

                    location.reload();
                } else {
                    this.errorMessage = "Email or Password is incorrect";
                }
            },
            error => {
                let message = error.json().error_description;
                if(message){
                    this.errorMessage = message;
                }else{
                    this.errorMessage = "Some error has occured";
                }                
            });
    }
}
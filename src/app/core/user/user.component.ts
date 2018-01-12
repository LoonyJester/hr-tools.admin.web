import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { User } from './user';
import { UserService } from './services/user.service';
import { Role, PrimaryCompanyRoles } from '../../common/authorization/role';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertType } from "../../common/alerts/alertType";
import { CompanyHelper } from "../../common/company/companyHelper";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'user',
    templateUrl: 'user.template.html',
    styleUrls: ['user.style.css'],
    outputs: ['operationCompleted', 'userRemoved'],
    providers: [UserService]
})

export class UserComponent implements OnInit {
    @Input() user?: User;
    public userForm: FormGroup;
    public operationCompleted = new EventEmitter<any>();
    public userRemoved = new EventEmitter<any>();

    public currentUser: User;
    public selectedRoles: any = [];
    public roles: Array<any> = [];// = this.mapRolesToSelectModel();
    public rolesAreEmpty: boolean = true;
    public rolesSelectIspristine: boolean = true;

    public isInAdd: boolean = false;
    public isInEdit: boolean = false;
    public isInResetPassword: boolean = false;
    public isPasswordValid: boolean = false;

    private allRoles: Array<Role>;

    constructor(private _userService: UserService,
        private _authService: AuthService,
        private formBuilder: FormBuilder,
        private companyHelper: CompanyHelper) {

    }

    ngOnInit() {
        if (!this.user) {
            this.currentUser = new User();
            this.isInAdd = true;
            this.isInResetPassword = true;
            this.currentUser.roles = null;
        } else {
            this.currentUser = this.copyObject(this.user);
            this.rolesAreEmpty = this.user.roles == null;
        }        

        this.userForm = new FormGroup({
            email: new FormControl({ value: this.currentUser.email, disabled: !this.isInEdit && !this.isInAdd }, [Validators.required,
            Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)]),
            fullName: new FormControl({ value: this.currentUser.fullName, disabled: !this.isInEdit && !this.isInAdd }, Validators.required),
            password: new FormControl(this.currentUser.password)
        });

        if (this.isInAdd) {
            this.userForm.controls['password'].setValidators(Validators.required);
        }

        this._userService.getAllRoles()
            .subscribe(
                response => {
                    this.allRoles = response;
                    let rolesExceptPrimaryCompanyRoles = response.filter(x => PrimaryCompanyRoles.indexOf(x.Name) < 0 );
                    this.roles = this.mapRolesToSelectModel(rolesExceptPrimaryCompanyRoles);
                    this.initRolesFilter();
                },
                error => {debugger;}
                );
    }

    private initRolesFilter(){
        if(!this.currentUser.roles){
            this.selectedRoles = [];

            return;
        }
        this.selectedRoles = this.mapRolesToSelectModel(this.currentUser.roles);
        if(this.selectedRoles.length == 0){
            return;
        }

        let lastId = this.selectedRoles.slice(-1)[0].id;

        let host: string = location.hostname;
        if(this.companyHelper.isCompanyPrimary(host)){
            for(let role of PrimaryCompanyRoles){
                this.roles.push({
                    id: ++lastId,
                    text: role 
                });
            }
            
        }
    }

    private mapRolesToSelectModel(roles: Array<Role>): Array<any> {
        let i = 1;
        let rolesArray = [];

        for(let role of roles){
            rolesArray.push({
                id: ++i,
                text: role.Name
            });
        }

        return rolesArray;
    }

    public edit(): void {
        this.isInEdit = true;
        this.enableForm();
    }

    private enableForm(): void {
        this.userForm.controls["email"].enable();
        this.userForm.controls["fullName"].enable();
    }

    public resetPassword(): void {
        this.isInResetPassword = true;
        this.user.password = undefined;
    }

    public cancel(): void {
        if (this.isInAdd) {
            this.userRemoved.emit({});
            return;
        }

        this.isInEdit = false;
        this.isInResetPassword = false;
        this.currentUser = this.copyObject(this.user);
        this.selectedRoles =  this.mapRolesToSelectModel(this.currentUser.roles);

        this.disableForm();
    }

    public rolesSelectUpdated(selectedRoles: any): void {
        this.rolesSelectIspristine = false;

        this.selectedRoles = selectedRoles;
        this.currentUser.roles = this.mapArrayToRolesArray(this.selectedRoles);

        if (this.selectedRoles.length == 0) {
            this.rolesAreEmpty = true;
        } else {
            this.rolesAreEmpty = false;
        }
    }

    private mapArrayToRolesArray(selectedRoles: Array<any>): Array<Role>{
        let roles: Array<Role> = [];

        for(let role of selectedRoles){    
            roles.push({
                Id: this.allRoles.find(x => x.Name == role.text).Id,
                Name: role.text
            });
        }

        return roles;
    }

    public save(): void {
        if (this.isInAdd) {
            this.createUser();
        } else if (this.isInEdit) {
            this.updateUser();
        }

        this.disableForm();
    }

    private createUser(): void {
        let user: User = this.currentUser;
        this._userService.create(user)
            .subscribe(
            userId => {
                if (userId) {
                    this.showResult(true, "User was successfully created", AlertType.Success, true);

                    //this.assignUserToEmployee(userId, user.email);
                } else {
                    this.showResult(false, "User was not created", AlertType.Error, false);
                }
            },
            error => {
                this.handleError(error);
            }
            );
    }

    private assignUserToEmployee(userId: string, login: string): void {
        this._userService.assignUserToEmployee(userId, login)
            .subscribe(
            result => {
                if (!result.wasAssigned) {
                    this.showResult(false, "User was not assigned to an employee with same company email", AlertType.Error, false);
                } else {
                    this.currentUser.assignedEmployeeName = result.fullName;
                    this.showResult(true, "User was successfully assigned to an employee with same company email", AlertType.Success, true);
                }

                // if (wasAssigned) {
                //     this.showResult(true, "User was successfully assigned to an employee with same company email", "success", true);                    
                // } else {
                //     this.showResult(false, "User was not assigned to an employee with same company email", "error", false);
                // }
                // this.user = this.copyObject(this.currentUser);
            },
            error => {
                this.handleError(error);
            }
            );
    }

    private updateUser(): void {
        let user: User = this.currentUser;
        this._userService.update(user)
            .subscribe(
            wasUpdated => {
                if (wasUpdated) {
                    //this.assignUserToEmployee(user.id, user.email);

                    this.showResult(true, "User was successfully updated", AlertType.Success, true);

                    this.isInEdit = false;
                    this.isInResetPassword = false;

                    this.user = this.copyObject(this.currentUser);
                } else {
                    this.showResult(false, "User was not updated", AlertType.Error, false);
                }
            },
            error => {
                this.handleError(error);
            }
            );
    }

    private copyObject(source: any): any {
        return <User>JSON.parse(JSON.stringify(source));
    }

    private disableForm(): void {
        this.userForm.controls["email"].disable();
        this.userForm.controls["fullName"].disable();
    }

    public activate(activate: boolean): void {
        this._userService.activate(this.currentUser.id, activate)
            .subscribe(
            wasActivated => {
                if (wasActivated) {
                    if (activate) {
                        this.showResult(true, "User was successfully activated", AlertType.Success, true);
                    } else {
                        this.showResult(true, "User was successfully deactivated", AlertType.Success, true);
                    }

                    this.currentUser.isActivated = activate;
                    this.user.isActivated = activate;
                } else {
                    this.showResult(false, "User was not updated", AlertType.Error, false);
                }
            },
            error => {
                this.handleError(error);
            }
            );
    }

    public generateRandomPassword(): void {
        let mask = '';
        let chars = '#aA';
        let length = 10;
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += mask[Math.round(Math.random() * (mask.length - 1))];
        }

        this.currentUser.password = result;

        this.validatePassword();
        if (!this.isPasswordValid) {
            this.generateRandomPassword();
        }

        this.userForm.controls["password"].markAsDirty();
    }

    public validatePassword(): void {
        // remove spaces
        this.currentUser.password = this.currentUser.password.replace(/\s+/g, '');

        let isValid: boolean = true;

        if (this.currentUser.password.length < 8)
            isValid = false;
        if (this.currentUser.password.length >= 50)
            isValid = false;
        if (!/\d/.test(this.currentUser.password))
            isValid = false;
        if (!/[a-z]/.test(this.currentUser.password))
            isValid = false;
        if (!/[A-Z]/.test(this.currentUser.password))
            isValid = false;
        if (/[^0-9a-zA-Z]/.test(this.currentUser.password))
            isValid = false;

        this.isPasswordValid = isValid;
    }

    public cancelResetPassword(): void {
        this.currentUser.password = undefined;
        this.isInResetPassword = false;

        this.rolesSelectIspristine = true;
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error && error._body) {
            try {
                let errorBody = JSON.parse(error._body);
                if (errorBody.Message) {
                    errorMessage = errorBody.Message;
                } else {
                    errorMessage = errorBody;
                }
            } catch (ex) {
            }
        }

        if (error && error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.showResult(false, errorMessage, AlertType.Error, false);
        console.log(error);
    }

    private showResult(wasOperationSucceed: boolean, message: any, type: string, dataNeedToBeReloaded: boolean) {
        if (!wasOperationSucceed && message._body) {
            let error = JSON.parse(message._body);
            if (error) {
                message = error.Message;
            }
        }

        let notification = {
            wasOperationSucceed: wasOperationSucceed,
            message: message,
            type: type,
            dataNeedToBeReloaded: dataNeedToBeReloaded
        };

        this.operationCompleted.emit(notification);
    }
}
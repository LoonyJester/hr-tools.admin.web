import { Component, TemplateRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { UserService } from './services/user.service';
import { UserFilter } from './userFilter';
import { User } from './user';
import { UserComponent } from './user.component';
import { UserTableSettings } from './userTableSettings';
import { AlertType } from "../../common/alerts/alertType";
import { IMultiSelectOption } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { MultiselectDropdown } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { AuthService } from '../../common/authorization/services/auth.service';
import { Role } from '../../common/authorization/role';

@Component({
    selector: 'user-list',
    templateUrl: 'user-list.template.html',
    styleUrls: ['user-list.style.css'],
    providers: [UserService, UserFilter]
})

export class UserListComponent {
    @ViewChild('addUserTarget', { read: ViewContainerRef }) addUserTarget;
    @ViewChild(MultiselectDropdown) rolesFilter: MultiselectDropdown;

    public userList: Array<User>;
    public alerts: Array<any> = [];
    public filters: UserFilter = new UserFilter(this._userService);
    public userTableSettings: UserTableSettings;
    public selectedRoles: number[];
    public isInAdd: boolean;
    public isLoading: boolean = true;

    constructor(private _userService: UserService,
        private template: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _authService: AuthService) {

        this.userTableSettings = new UserTableSettings(0, 1, 8, '', this.filters);
        this.resetFilters();

        this.getAll(this.userTableSettings);
    }

    public search(searchKeyword: string, filters: UserFilter): void {
        this.userTableSettings.searchKeyword = searchKeyword;
        this.userTableSettings.userFilter = filters;
        this.userTableSettings.currentPage = 1;

        this.getAll(this.userTableSettings);
    }

    public resetFilters(): void {
        this.filters.isActivated = this.filters.isActivatedOptions[0].id;
        this.filters.selectedRoles = null;

        if (this.rolesFilter) {
            this.rolesFilter.uncheckAll();
        }
    }

    public addRow(): void {
        let factory = this.componentFactoryResolver.resolveComponentFactory(UserComponent);
        let componentRef = this.addUserTarget.createComponent(factory);
        this.isInAdd = true;

        componentRef.instance.operationCompleted.subscribe(val => {
            this.onOperationCompleted(val);
            this.addUserTarget.remove();
            this.isInAdd = false;
        });

        componentRef.instance.userRemoved.subscribe(val => {
            this.addUserTarget.remove();
            this.isInAdd = false;
        });
    }

    public onPageChanged(event: any): void {
        this.userTableSettings.currentPage = event.page;

        this.getAll(this.userTableSettings);
    }

    public onRolesChange(event: any): void {
        Object.keys(this.filters.rolesList).indexOf(event);

        this.filters.selectedRoles = null;
        let allRoles = this.filters.allRoles;

        for (let index in event) {
            // get value by key in rolesList
            let that = this;
            this.filters.rolesList.map((v) => {
                if (v.id == +event[index]) {
                    
                    let role = allRoles.find(x => x.Name == v.name);

                    if(!that.filters.selectedRoles){
                        that.filters.selectedRoles = [];
                    }

                    that.filters.selectedRoles.push({
                        Id: role.Id,
                        Name: role.Name
                    });
                }
            });
        }
    }

    public onOperationCompleted(event: any): void {
        this.showResult(event.wasOperationSucceed, event.message, event.type);

        if (event.wasOperationSucceed) {
            this.getAll(this.userTableSettings);
        }
    }

    private getAll(userTableSettings: UserTableSettings): Array<User> {
        this._userService.getAll(userTableSettings)
            .subscribe(response => {
                this.userList = response.data;
                this.userTableSettings.totalCount = response.totalCount;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.userList;
    }

    public onUserRemoved(): void {
        this.userList.pop();
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.isLoading = false;
        this.showResult(false, errorMessage, AlertType.Error);
        console.log(error);
    }

    private showResult(wasOperationSucceed: boolean, message: string, type: string): void {
        this.alerts.push({
            type: type,
            msg: message,
            timeout: 4000
        });
    }
}
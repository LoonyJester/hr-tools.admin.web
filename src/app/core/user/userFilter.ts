import { Injectable, OnInit } from '@angular/core';
import { UserActivationStatus } from './enums/UserActivationStatus';
import { IMultiSelectOption, IMultiSelectTexts } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { Role } from '../../common/authorization/role';
import { UserService } from './services/user.service';

@Injectable()
export class UserFilter implements OnInit {
    public allRolesText = "All Roles";

    allRoles: Array<Role>;
    rolesList: IMultiSelectOption[] = [];
    selectedRoles: Array<Role> = [];

    isActivatedOptions: Array<any>;
    isActivated: boolean = null;

    public allActivatedText: string = "All (Activated, Not activated)";
    public selectRolesTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select roles',
    };

    constructor(public _userService: UserService) {
        this.isActivatedOptions = [
            { id: UserActivationStatus.Both, value: this.allActivatedText },
            { id: UserActivationStatus.Activated, value: UserActivationStatus[UserActivationStatus.Activated] },
            { id: UserActivationStatus.Deactivated, value: UserActivationStatus[UserActivationStatus.Deactivated] }];

        let that = this;
        this._userService.getAllRoles()
            .subscribe(
            response => {
                that.allRoles = response;

                let i: number = 1;
                for (let role of response) {
                    that.rolesList.push({
                        id: i++,
                        name: role.Name
                    });
                }
            },
            error => { debugger; }
            );
    }

    ngOnInit() {

    }

    public isEmpty(): boolean {
        return this.selectedRoles == null;
    }
}

import { Injectable } from '@angular/core';
import { Role } from '../../common/authorization/role';

@Injectable()
export class User {
    public id: string;
    public email: string;
    public password: string;
    public fullName: string;
    public roles?: Array<Role>;
    public isActivated: boolean;
    public siteId: string;
    public assignedEmployeeName?: string;
}
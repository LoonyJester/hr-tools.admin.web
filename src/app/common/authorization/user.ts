import { Injectable } from '@angular/core';
import { Role } from './role';

@Injectable()
export class User{
    public name: string;
    public roles: Array<Role>;
}
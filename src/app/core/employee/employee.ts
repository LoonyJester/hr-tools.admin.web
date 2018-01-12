import { Injectable } from '@angular/core';
import { City } from '../company/officeLocation';

@Injectable()
export class Employee {
    public id: string;
    public fullName: string;
    public fullNameCyrillic: string;
    public patronymicCyrillic: string;
    public officeLocation: City;
    public jobTitle: string;
    public departmentName: string;
    public technology: string;
    public projectName: string;
    public companyEmail: string;
    public personalEmail: string;
    public messengerName: string;
    public messengerLogin: string;
    public mobileNumber: string;
    public additionalMobileNumber: string;
    public birthday: Date;
    public status: number;
    public startDate: Date;
    public terminationDate: Date;
    public daysSkipped: number;
    public bioUrl: string;
    public notes: string;
    public photo: any;

    public country: string;
    public city: string;

    public employeeIdForFiles?: string;

    constructor() {
    }
}
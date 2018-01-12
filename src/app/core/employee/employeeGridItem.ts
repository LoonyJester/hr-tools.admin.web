import { Injectable } from '@angular/core';
import { Employee } from "./employee";
import { City } from '../company/officeLocation';

@Injectable()
export class EmployeeGridItem implements Employee {
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

    public edit: string;
    public _delete: string;

    constructor(employee: Employee) {
        this.id = employee.id;
        this.fullName = employee.fullName;
        this.fullNameCyrillic = employee.fullNameCyrillic;
        this.patronymicCyrillic = employee.patronymicCyrillic;
        this.officeLocation = employee.officeLocation;
        this.jobTitle = employee.jobTitle;
        this.departmentName = employee.departmentName;
        this.technology = employee.technology;
        this.projectName = employee.projectName;
        this.companyEmail = employee.companyEmail;
        this.personalEmail = employee.personalEmail;
        this.messengerName = employee.messengerName;
        this.messengerLogin = employee.messengerLogin;
        this.mobileNumber = employee.mobileNumber;
        this.additionalMobileNumber = employee.additionalMobileNumber;
        this.birthday = employee.birthday;
        this.status = employee.status;
        this.startDate = employee.startDate;
        this.terminationDate = employee.terminationDate;
        this.daysSkipped = employee.daysSkipped;
        this.bioUrl = employee.bioUrl;
        this.notes = employee.notes;
        this.photo = employee.photo;
        this.country = employee.country;
        this.city = employee.city;
    }
}
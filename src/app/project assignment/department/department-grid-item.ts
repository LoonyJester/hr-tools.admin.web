import { Injectable } from "@angular/core";
import { Department } from "../common/department";

@Injectable()
export class DepartmentGridItem implements Department {
    public id: number;
    public name: string;
    public description?: string;

    public edit: string;
    public _delete: string;

    constructor(department: Department) {
        this.id = department.id;
        this.name = department.name;
        this.description = department.description;
    }
}
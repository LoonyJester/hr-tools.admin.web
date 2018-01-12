import { Injectable } from "@angular/core";

@Injectable()
export class Department {
    public id: number;
    public name: string;
    public description?: string;
}
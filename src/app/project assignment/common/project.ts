import { Injectable } from "@angular/core";

@Injectable()
export class Project {
    public id: number;
    public name: string;
    public description?: string;
    public startDate: Date;
    public endDate?: Date;
    public isActive: boolean;
}
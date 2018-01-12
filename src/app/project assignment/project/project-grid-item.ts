import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Project } from "../common/project";

@Injectable()
export class ProjectGridItem implements Project {
    public id: number;
    public name: string;
    public description?: string;
    public startDate: Date;
    public endDate?: Date;
    public startDateToDisplay: string;
    public endDateToDisplay?: string;
    public isActive: boolean;

    public activate: string;
    public edit: string;
    public _delete: string;

    constructor(project: Project) {
        let datePipe: DatePipe = new DatePipe("en-US");

        this.id = project.id;
        this.name = project.name;
        this.description = project.description;
        this.startDate = project.startDate;
        this.endDate = project.endDate;
        this.startDateToDisplay = datePipe.transform(project.startDate, "dd/MM/yyyy");
        this.endDateToDisplay = project.endDate == null ? "" : datePipe.transform(project.endDate, "dd/MM/yyyy");
        this.isActive = project.isActive;
    }
}
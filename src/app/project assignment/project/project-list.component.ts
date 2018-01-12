import { Component, Input, ViewChild } from '@angular/core';
import { ProjectService } from './services/project.service';
import { EmployeeComponent } from './employee.component';
import { Project } from '../common/project';
import { ProjectGridSettings } from './project-grid-settings';
import { ProjectGridItem } from './project-grid-item';
import { AlertType } from "../../common/alerts/alertType";
import { BreadcrumbComponent } from '/common/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '/common/page header/page-header.component';
import { PaginationComponent } from 'ng2-bootstrap/ng2-bootstrap';
import { UrlHelper } from "../../common/company/urlHelper";
import { Grid } from '../../common/grid/grid';
import { Column } from '../../common/grid/column';
import { AddEditProjectModalComponent } from "./modals/addEdit/addEditProjectModal.component";
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'project-list',
    templateUrl: 'project-list.template.html',
    providers: [ProjectService, UrlHelper, AuthService]
})

export class ProjectListComponent {
    @ViewChild(AddEditProjectModalComponent) addEditModal: AddEditProjectModalComponent
    @ViewChild(DeleteConfirmationModalComponent) confirmDeleteModal: DeleteConfirmationModalComponent

    public projects: Array<ProjectGridItem>;
    public gridSettings: ProjectGridSettings;
    public columns: Array<any>;

    public alerts: any = [];
    public isLoading: boolean = true;    

    constructor(private _projectService: ProjectService,
        private _authService: AuthService) {
        this.gridSettings = new ProjectGridSettings(0, 1, 15, "Name", true, "");

        this.projects = this.getAll(this.gridSettings);
        this.columns = this.getColumns();
    }    

    private getColumns(): Array<any> {
        return [
            { title: 'Project Name', name: 'name', className: ["width20Perc"] },
            { title: 'Description', name: 'description', className: ["width40Perc"] },
            { title: 'Start Date', name: 'startDateToDisplay', className: ["width10Perc"] },
            { title: 'End Date', name: 'endDateToDisplay', className: ["width10Perc"] },
            { title: 'Activate/Deactivate', name: 'activate', className: "width10Perc", sort: false },
            { title: 'Edit', name: 'edit', className: "width5Perc", sort: false },
            { title: 'Delete', name: '_delete', className: "width5Perc", sort: false }
        ];
    }

    public search(searchKeyword: string): void {
        this.isLoading = true;
        this.gridSettings.searchKeyword = searchKeyword;

        this.getAll(this.gridSettings);
    }

    public add(): void {
        this.addEditModal.showChildModal("Create", new Project());
    }

    public onCellClicked(event: any): void {
        if (event.column == "edit") {
            this._edit(event.row);
        } else if (event.column == "_delete") {
            this._delete(event.row)
        } else if (event.column == "activate") {
            this._activate(event.row)
        }
    }

    private _edit(row: Project): void {
        let rowCopy = <Project>JSON.parse(JSON.stringify(row));

        this.addEditModal.showChildModal("Edit", rowCopy);
    }

    private _delete(row: ProjectGridItem): void {
        this.confirmDeleteModal.show(row);
    }

    private _activate(row: Project): void {
        this.isLoading = true;
        row.isActive = !row.isActive;

        this._projectService.activate(row.id, row.isActive)
            .subscribe(response => {
                if (response) {
                    this.showResult(response, "Project was successfully " + (row.isActive == true ? "activated" : "deactivated"), AlertType.Success);
                    this.getAll(this.gridSettings);
                } else {
                    this.showResult(response, "Project was not " + (row.isActive == true ? "activated" : "deactivated"), AlertType.Error);
                }
            }
            , error => this.handleError(error));
    }

    public onGridStateChanged(event: any): void {
        this.isLoading = true;

        this.gridSettings.currentPage = event.currentPage;
        if (event.sortColumnName) {
            this.gridSettings.sortColumnName = event.sortColumnName;
        }
        this.gridSettings.isDescending = event.isDescending;

        this.getAll(this.gridSettings);
    }

    public onPageChanged(event: any): void {
        this.isLoading = true;
        this.gridSettings.currentPage = event.page;

        this.getAll(this.gridSettings);
    }

    public onDelete(row: ProjectGridItem): boolean {
        this.isLoading = true;
        let wasDeleted: boolean;

        this._projectService.delete(row.id)
            .subscribe(
            response => {
                wasDeleted = response;

                if (wasDeleted) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasDeleted, "Project was successfully deleted", AlertType.Success);
                } else {
                    this.showResult(wasDeleted, "Project was not deleted", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        this.getAll(this.gridSettings);

        return wasDeleted;
    }

    public onSaved(project: Project): void {
        this.isLoading = true;

        if (project.id) {
            this.update(project);
        } else {
            this.create(project);
        }
    }

    private update(project: Project): void {
        let wasUpdated: boolean;

        this._projectService.update(project)
            .subscribe(
            response => {
                wasUpdated = response;

                if (wasUpdated) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasUpdated, "Project was successfully updated", AlertType.Success);
                } else {
                    this.showResult(wasUpdated, "Project was not upated", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );
    }

    private create(project: Project): boolean {
        let wasCreated: boolean = false;

        this._projectService.create(project)
            .subscribe(
            response => {
                wasCreated = response;

                if (wasCreated) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasCreated, "Project was successfully created", AlertType.Success);
                } else {
                    this.showResult(wasCreated, "Project was not created", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        return wasCreated;
    }

    private getAll(gridSettings: ProjectGridSettings): Array<ProjectGridItem> {
        this._projectService.getAll(gridSettings)
            .subscribe(response => {
                this.projects = response.data.map(this.mapProjectAssignmentsToGridItem);
                this.gridSettings.totalCount = response.totalCount;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.projects;
    }

    private mapProjectAssignmentsToGridItem(project: Project): ProjectGridItem {
        let result: ProjectGridItem = new ProjectGridItem(project);

        if (project.isActive) {
            result.activate = '<button class="btn btn-sm btn-default">deactivate</button>';
        } else {
            result.activate = '<button class="btn btn-sm btn-default">activate</button>';
        }

        result.edit = '<i class="fa fa-pencil-square-o"></i>';
        result._delete = '<i class="fa fa-times"></i>';

        return result;
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody = JSON.parse(error._body);
            if(errorBody.Message){
                errorMessage = errorBody.Message;
            }else{
                errorMessage = errorBody;
            }            
        }

        if (error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.showResult(false, errorMessage, AlertType.Error);
        console.log(error);
    }

    private showResult(wasOperationSucceed: boolean, message: string, type: string): void {
        this.isLoading = false;

        this.alerts.push({
            type: type,
            msg: message,
            timeout: 4000
        });
    }
}
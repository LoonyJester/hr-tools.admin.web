import { Component, TemplateRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AlertType } from "../../common/alerts/alertType";
import { Department } from "../common/department";
import { DepartmentTableSettings } from "./department-table-settings";
import { DepartmentService } from "./services/department.service";
import { DepartmentComponent } from "./department.component";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'department-list',
    templateUrl: 'department-list.template.html',
    providers: [DepartmentService]
})

export class DepartmentListComponent {
    @ViewChild('addDepartmentTarget', { read: ViewContainerRef }) addDepartmentTarget;

    public departmentList: Array<Department>;    
    public searchKeyword: string = "";
    public isInAdd: boolean;
    public isLoading: boolean = true;
    public alerts: Array<any> = [];

    constructor(private _departmentService: DepartmentService,
        private _authService: AuthService,
        private template: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {

        this.getAll(this.searchKeyword);
    }    

    public search(searchKeyword: string): void {
        this.isLoading = true;
        this.searchKeyword = searchKeyword;

        this.getAll(this.searchKeyword);
    }

    public addRow(): void {
        let factory = this.componentFactoryResolver.resolveComponentFactory(DepartmentComponent);
        let componentRef = this.addDepartmentTarget.createComponent(factory);
        this.isInAdd = true;

        componentRef.instance.operationStarted.subscribe(val => {
            this.isLoading = true;
        });

        componentRef.instance.operationCompleted.subscribe(val => {
            this.onOperationCompleted(val);
            this.addDepartmentTarget.remove();
            this.isInAdd = false;
            this.isLoading = false;
        });

        componentRef.instance.departmentRemoved.subscribe(val => {
            this.addDepartmentTarget.remove();
            this.isInAdd = false;
        });
    }

    public onOperationStarted(): void{
        this.isLoading = true;
    }

    public onOperationCompleted(event: any): void {
        this.showResult(event.wasOperationSucceed, event.message, event.type);

        if (event.wasOperationSucceed) {
            this.getAll(this.searchKeyword);
        }
    }

    public onDepartmentRemoved(): void {
        this.departmentList.pop();
    }

    public onDepartmentDeleted(id: number) {
        this.isLoading = true;
        let wasDeleted: boolean;

        this._departmentService.delete(id)
            .subscribe(
            response => {
                wasDeleted = response;

                if (wasDeleted) {
                    this.getAll(this.searchKeyword);
                    this.showResult(wasDeleted, "Department was successfully deleted", AlertType.Success);
                } else {
                    this.showResult(wasDeleted, "Department was not deleted", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        this.getAll(this.searchKeyword);

        return wasDeleted;
    }

    private getAll(searchKeyword: string): Array<Department> {
        this._departmentService.getAll(searchKeyword)
            .subscribe(response => {
                this.departmentList = response;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.departmentList;
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody: any = JSON.parse(error._body);
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

    private showResult(wasOperationSucceed: boolean, message: string, type: string) {
        this.isLoading = false;

        this.alerts.push({
            type: type,
            msg: message,
            timeout: 4000
        });
    }
}
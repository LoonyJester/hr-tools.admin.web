import { Component, TemplateRef, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { AlertType } from "../../common/alerts/alertType";
import { JobTitle } from "./job-title";
import { JobTitleService } from "./services/job-title.service";
import { JobTitleComponent } from "./job-title.component";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'job-title-list',
    templateUrl: 'job-title-list.template.html',
    providers: [JobTitleService]
})

export class JobTitleListComponent {
    @ViewChild('addJobTitleTarget', { read: ViewContainerRef }) addJobTitleTarget;

    public jobTitleList: Array<JobTitle>;
    public alerts: any = [];
    public isInAdd: boolean;
    public isLoading: boolean = true;    

    constructor(private _jobTitleService: JobTitleService,
        private _authService: AuthService,
        private template: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver) {

        this.getAll();
    }

    private getAll(): Array<JobTitle> {
        this._jobTitleService.getAll()
            .subscribe(response => {
                this.jobTitleList = response;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.jobTitleList;
    }

    public addRow(): void {
        let factory = this.componentFactoryResolver.resolveComponentFactory(JobTitleComponent);
        let componentRef = this.addJobTitleTarget.createComponent(factory);
        this.isInAdd = true;

        componentRef.instance.operationStarted.subscribe(val => {
            this.isLoading = true;
        });

        componentRef.instance.operationCompleted.subscribe(val => {
            this.onOperationCompleted(val);
            this.addJobTitleTarget.remove();
            this.isInAdd = false;
            this.isLoading = false;
        });

        componentRef.instance.jobTitleRemoved.subscribe(val => {
            this.addJobTitleTarget.remove();
            this.isInAdd = false;
        });
    }

    public onOperationStarted(): void{
        this.isLoading = true;
    }

    public onOperationCompleted(event: any): void {
        this.showResult(event.wasOperationSucceed, event.message, event.type);

        if (event.wasOperationSucceed) {
            this.getAll();
        }
    }

    public onJobTitleRemoved(event: any): void {
        this.jobTitleList.pop();
    }

    public onJobTitleDeleted(id: number): boolean {
        let wasDeleted: boolean;

        this._jobTitleService.delete(id)
            .subscribe(
            response => {
                wasDeleted = response;

                if (wasDeleted) {
                    this.getAll();
                    this.showResult(wasDeleted, "Job Title was successfully deleted", AlertType.Success);
                } else {
                    this.showResult(wasDeleted, "Job Title was not deleted", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        this.getAll();

        return wasDeleted;
    }

    public isJobTitleListEmpty(): boolean {
        return this.jobTitleList && this.jobTitleList.length == 0;
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
            //this._authService.handleUnauhorizedError();
        }

        this.isLoading = false;
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
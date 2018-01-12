import { Component, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { JobTitle } from './job-title';
import { JobTitleService } from './services/job-title.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { AlertType } from "../../common/alerts/alertType";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'job-title',
    templateUrl: 'job-title.template.html',
    outputs: ['operationStarted', 'operationCompleted', 'jobTitleRemoved', "jobTitleDeleted"],
    providers: [JobTitleService]
})

export class JobTitleComponent implements OnInit {
    @Input() jobTitle?: JobTitle;
    @ViewChild(DeleteConfirmationModalComponent) confirmDeleteModal: DeleteConfirmationModalComponent

    public jobTitleForm: FormGroup;
    public operationStarted = new EventEmitter<any>();
    public operationCompleted = new EventEmitter<any>();
    public jobTitleRemoved = new EventEmitter<any>();
    public jobTitleDeleted = new EventEmitter<any>();

    public currentJobTitle: JobTitle;

    public isInEdit: boolean = false;
    public isInAdd: boolean = false;

    constructor(private _jobTitleService: JobTitleService,
        private _authService: AuthService) {
    }

    ngOnInit() {
        if (!this.jobTitle) {
            this.currentJobTitle = new JobTitle();
            this.isInAdd = true;
        } else {
            this.currentJobTitle = this.copyObject(this.jobTitle);
        }

        this.jobTitleForm = new FormGroup({
            name: new FormControl({ value: this.currentJobTitle.Name, disabled: !this.isInEdit && !this.isInAdd }, Validators.required),
        });
    }

    public edit(): void {
        this.isInEdit = true;
        this.enableForm();
    }

    private enableForm(): void {
        this.jobTitleForm.controls["name"].enable()
    }

    public delete(): void {
        this.confirmDeleteModal.show(this.jobTitle);
    }

    public onDelete(jobTitle: JobTitle): void {
        this.jobTitleDeleted.emit(jobTitle.Id);
    }

    public cancel(): void {
        if (this.isInAdd) {
            this.jobTitleRemoved.emit({});
            return;
        }

        this.isInEdit = false;
        this.currentJobTitle = this.copyObject(this.jobTitle);

        this.disableForm();
    }

    public save(): void {
        this.operationStarted.emit();

        if (this.isInEdit) {
            this.updateJobTitle();
        }
        if (this.isInAdd) {
            this.createJobTitle();
        }

        this.disableForm();
    }

    private updateJobTitle(): void {
        let jobTitle: JobTitle = this.currentJobTitle;

        this._jobTitleService.update(jobTitle)
            .subscribe(
            wasUpdated => {
                if (wasUpdated) {
                    this.showResult(true, "Job Title was successfully updated", AlertType.Success, true);

                    this.isInEdit = false;

                    this.jobTitle = this.copyObject(this.currentJobTitle);
                } else {
                    this.showResult(false, "Job Title was not updated", AlertType.Error, false);
                }
            },
            error => {
                this.handleError(error);
                this.cancel();
            });
    }

    private copyObject(source: any): any {
        return <JobTitle>JSON.parse(JSON.stringify(source));
    }

    private createJobTitle(): void {
        let jobTitle: JobTitle = this.currentJobTitle;
        this._jobTitleService.create(jobTitle)
            .subscribe(
            jobTitleId => {
                if (jobTitleId) {
                    this.showResult(true, "Job Title was successfully created", AlertType.Success, true);
                } else {
                    this.showResult(false, "Job Title was not created", AlertType.Error, false);
                }
            },
            error => this.handleError(error)
            );
    }

    private disableForm(): void {
        this.jobTitleForm.controls["name"].disable();
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error && error._body) {
            try {
                let errorBody = JSON.parse(error._body);

                if (errorBody.Message) {
                    errorMessage = errorBody.Message;
                } else {
                    errorMessage = errorBody;
                }
            } catch (ex) {
            }
        }

        if (error && error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.showResult(false, errorMessage, AlertType.Error, false);
        console.log(error);
    }

    private showResult(wasOperationSucceed: boolean, message: any, type: string, dataNeedToBeReloaded: boolean): void {
        if (!wasOperationSucceed && message._body) {
            let error = JSON.parse(message._body);
            if (error) {
                message = error.Message;
            }
        }

        let notification = {
            wasOperationSucceed: wasOperationSucceed,
            message: message,
            type: type,
            dataNeedToBeReloaded: dataNeedToBeReloaded
        };

        this.operationCompleted.emit(notification);
    }
}
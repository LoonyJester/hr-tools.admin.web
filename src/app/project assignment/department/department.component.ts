import { Component, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Department } from '../common/department';
import { DepartmentService } from './services/department.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { AlertType } from "../../common/alerts/alertType";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'department',
    templateUrl: 'department.template.html',
    styleUrls: ['department.style.css'],
    outputs: ['operationStarted', 'operationCompleted', 'departmentRemoved', "departmentDeleted"],
    providers: [DepartmentService]
})

export class DepartmentComponent implements OnInit {
    @Input() department?: Department;
    @ViewChild(DeleteConfirmationModalComponent) confirmDeleteModal: DeleteConfirmationModalComponent

    public departmentForm: FormGroup;
    public operationStarted = new EventEmitter<any>();
    public operationCompleted = new EventEmitter<any>();
    public departmentRemoved = new EventEmitter<any>();
    public departmentDeleted = new EventEmitter<any>();

    public currentDepartment: Department;

    public isInEdit: boolean = false;
    public isInAdd: boolean = false;

    constructor(private _departmentService: DepartmentService,
        private _authService: AuthService) {

    }

    ngOnInit() {
        if (!this.department) {
            this.currentDepartment = new Department();
            this.isInAdd = true;
        } else {
            this.currentDepartment = this.copyObject(this.department);
        }

        this.departmentForm = new FormGroup({
            name: new FormControl({ value: this.currentDepartment.name, disabled: !this.isInEdit && !this.isInAdd }, Validators.required),
            description: new FormControl({ value: this.currentDepartment.description, disabled: !this.isInEdit && !this.isInAdd })
        });
    }

    public edit(): void {
        this.isInEdit = true;
        this.enableForm();
    }

    private enableForm(): void {
        this.departmentForm.controls["name"].enable();
        this.departmentForm.controls["description"].enable();
    }

    public delete(): void {
        this.confirmDeleteModal.show(this.department);
    }

    public onDelete(department: Department): void {
        this.departmentDeleted.emit(department.id);
    }

    public cancel(): void {
        if (this.isInAdd) {
            this.departmentRemoved.emit({});
            return;
        }

        this.isInEdit = false;
        this.currentDepartment = this.copyObject(this.department);

        this.disableForm();
    }

    public save(): void {
        if (this.isInAdd) {
            this.createDepartment();
        }
        if (this.isInEdit) {
            this.updateDepartment();
        }

        this.disableForm();
    }

    private createDepartment(): void {
        this.operationStarted.emit();
        let department: Department = this.currentDepartment;

        this._departmentService.create(department)
            .subscribe(
            departmentId => {
                if (departmentId) {
                    this.showResult(true, "Department was successfully created", AlertType.Success, true);
                } else {
                    this.showResult(false, "Department was not created", AlertType.Error, false);
                }
            },
            error => this.handleError(error)
            );
    }

    private updateDepartment(): void {
        this.operationStarted.emit();
        let department: Department = this.currentDepartment;
        
        this._departmentService.update(department)
            .subscribe(
            wasUpdated => {
                if (wasUpdated) {
                    this.showResult(true, "Department was successfully updated", AlertType.Success, true);

                    this.isInEdit = false;

                    this.department = this.copyObject(this.currentDepartment);
                } else {
                    this.showResult(false, "Department was not updated", AlertType.Error, false);
                }
            },
            error => {
                this.handleError(error);
                this.cancel();
            });
    }

    private copyObject(source: any): any {
        return <Department>JSON.parse(JSON.stringify(source));
    }

    private disableForm(): any {
        this.departmentForm.controls["name"].disable();
        this.departmentForm.controls["description"].disable();
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
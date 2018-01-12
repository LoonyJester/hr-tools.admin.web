import { Component, Input, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Technology } from './technology';
import { TechnologyService } from './services/technology.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { AlertType } from "../../common/alerts/alertType";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'technology',
    templateUrl: 'technology.template.html',
    outputs: ['operationStarted', 'operationCompleted', 'technologyRemoved', "technologyDeleted"],
    providers: [TechnologyService]
})

export class TechnologyComponent implements OnInit {
    @Input() technology?: Technology;
    @ViewChild(DeleteConfirmationModalComponent) confirmDeleteModal: DeleteConfirmationModalComponent

    public technologyForm: FormGroup;
    public operationStarted = new EventEmitter<any>();
    public operationCompleted = new EventEmitter<any>();
    public technologyRemoved = new EventEmitter<any>();
    public technologyDeleted = new EventEmitter<any>();

    public currentTechnology: Technology;

    public isInEdit: boolean = false;
    public isInAdd: boolean = false;

    constructor(private _technologyService: TechnologyService,
        private _authService: AuthService) {
    }

    ngOnInit() {
        if (!this.technology) {
            this.currentTechnology = new Technology();
            this.isInAdd = true;
        } else {
            this.currentTechnology = this.copyObject(this.technology);
        }

        this.technologyForm = new FormGroup({
            name: new FormControl({ value: this.currentTechnology.Name, disabled: !this.isInEdit && !this.isInAdd }, Validators.required),
        });
    }

    public edit(): void {
        this.isInEdit = true;
        this.enableForm();
    }

    private enableForm(): void {
        this.technologyForm.controls["name"].enable()
    }

    public delete(): void {
        this.confirmDeleteModal.show(this.technology);
    }

    public onDelete(technology: Technology): void {
        this.technologyDeleted.emit(technology.Id);
    }

    public cancel(): void {
        if (this.isInAdd) {
            this.technologyRemoved.emit({});
            return;
        }

        this.isInEdit = false;
        this.currentTechnology = this.copyObject(this.technology);

        this.disableForm();
    }

    public save(): void {
        this.operationStarted.emit();

        if (this.isInAdd) {
            this.create();
        }
        if (this.isInEdit) {
            this.update();
        }

        this.disableForm();
    }

    private create(): void {
        let technology: Technology = this.currentTechnology;
        this._technologyService.create(technology)
            .subscribe(
            id => {
                if (id) {
                    this.showResult(true, "Technology was successfully created", AlertType.Success, true);
                } else {
                    this.showResult(false, "Technology was not created", AlertType.Error, false);
                }
            },
            error => this.handleError(error)
            );
    }

    private update(): void {
        let technology: Technology = this.currentTechnology;
        this._technologyService.update(technology)
            .subscribe(
            wasUpdated => {
                if (wasUpdated) {
                    this.showResult(true, "Technology was successfully updated", AlertType.Success, true);

                    this.isInEdit = false;

                    this.technology = this.copyObject(this.currentTechnology);
                } else {
                    this.showResult(false, "Technology was not updated", AlertType.Error, false);
                }
            },
            error => {
                this.handleError(error);
                this.cancel();
            });
    }

    private copyObject(source: any): any {
        return <Technology>JSON.parse(JSON.stringify(source));
    }

    private disableForm(): void {
        this.technologyForm.controls["name"].disable();
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
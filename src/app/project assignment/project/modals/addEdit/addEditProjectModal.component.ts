import { Component, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Project } from '../../../common/project';
import { ProjectService } from '../../services/project.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap';
import { AuthService } from "../../../../common/authorization/services/auth.service";
import * as moment from 'moment';

@Component({
    selector: 'add-edit-project',
    templateUrl: 'addEditProjectModal.template.html',
    styleUrls: ['addEditProjectModal.style.css'],
    providers: [ProjectService, AuthService],
    outputs: ['projectSaved']
})

export class AddEditProjectModalComponent {
    @ViewChild('addModal') public childModal: ModalDirective;
    public addEditForm: FormGroup;
    public project: Project = new Project();
    public actionName: string;
    public projectSaved = new EventEmitter<any>();

    public isStartDatePickerOpened: boolean = false;
    public isEndDatePickerOpened: boolean = false;
    public datePickersValidationRules: any = {
        startDate: {
            minDate: new Date(),
            maxDate: new Date()
        },
        endDate: {
            minDate: new Date()
        }
    }

    private accessToken: string;
    private megabyteInBytes: number = 10000000;

    constructor(private _projectService: ProjectService,
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private _authService: AuthService) {

        this.addEditForm = formBuilder.group({
            name: [this.project.name, Validators.required],
            description: [this.project.description],
            startDate: [this.project.startDate],
            endDate: [this.project.endDate]
        });

        this.accessToken = this._authService.getAccessToken();
    }

    public showChildModal(actionName: string, row: Project = null): void {
        this.actionName = actionName;

        // if object is not empty
        if (Object.keys(row).length != 0) {
            let rowCopy = <Project>JSON.parse(JSON.stringify(row));
            this.project = rowCopy;
        } else {
            this.project = new Project();
        }

        this.initDatePickers();

        this.childModal.config.backdrop = false; // workaround 
        this.childModal.show();
    }

    private initDatePickers(): void {
        let date: Date = new Date();

        this.datePickersValidationRules.startDate.minDate.setFullYear(date.getFullYear() - 20);
        this.setStartDateMaxDate();
        this.setEndDateMinDate();
    }

    public save(): void {
        this.projectSaved.emit(this.project);
        this.hideChildModal();
    }

    private hideChildModal(): void {
        this.addEditForm.reset();
        this.childModal.hide();
    }
    
    public openStartDatePicker(): void {
        this.isStartDatePickerOpened = !this.isStartDatePickerOpened;

        if (this.isStartDatePickerOpened) {
            this.isEndDatePickerOpened = false;

            this.setStartDateMaxDate();
        }
    }

    private setStartDateMaxDate(): void {
        if (this.project.endDate) {
            this.datePickersValidationRules.startDate.maxDate = new Date(Date.parse(this.project.endDate.toString()));
        } else {
            this.datePickersValidationRules.startDate.maxDate = new Date();
        }
    }
        
    public openEndDatePicker(): void {
        this.isEndDatePickerOpened = !this.isEndDatePickerOpened;

        if (this.isEndDatePickerOpened) {
            this.isStartDatePickerOpened = false;

            this.setEndDateMinDate();
        }
    }

    private setEndDateMinDate(): void {
        if (this.project.startDate) {
            this.datePickersValidationRules.endDate.minDate = new Date(Date.parse(this.project.startDate.toString()));
        } else {
            this.datePickersValidationRules.endDate.minDate.setFullYear(new Date().getFullYear() - 20);
        }
    }

    public clearEndDatePicker(): void {
        this.project.endDate = null;
    }
}
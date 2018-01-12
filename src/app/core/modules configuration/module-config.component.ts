import { Component, Input, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { ModuleConfig } from "./module-config";
import { AlertType } from "../../common/alerts/alertType";
import { ModuleName } from "../../common/company/moduleName";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StopModuleConfirmationModalComponent } from './modals/stop-module-confirmation.component';
import { CompanyHelper } from "../../common/company/companyHelper";

@Component({
    selector: 'module-config',
    templateUrl: 'module-config.template.html',
    styleUrls: ['./module-config.style.css'],
    outputs: ['operationStarted', 'operationCanceled', 'operationFault', 'modifyModuleConfig'],
})

export class ModuleConfigComponent implements OnInit {
    @Input() areAllModulesStopped: boolean;
    @Input() moduleConfig: ModuleConfig;
    @Input() actualModuleConfigs: Array<ModuleConfig>;
    @ViewChild(StopModuleConfirmationModalComponent) stopConfirmDeleteModal: StopModuleConfirmationModalComponent

    public operationStarted = new EventEmitter<any>();
    public operationCanceled = new EventEmitter<any>();
    public operationFault = new EventEmitter<any>();
    public modifyModuleConfig = new EventEmitter<any>();

    public moduleConfigForm: FormGroup;

    public isCoreModule: boolean = false;
    public isModuleStarted: boolean = false;
    public isInEdit: boolean = false;
    public isInAdd: boolean = false;
    public canBeEditted: boolean = false;
    public canBeStopped: boolean = false;
    public currentModuleConfig: ModuleConfig;

    public isStartDatePickerOpened: boolean = false;
    public isEndDatePickerOpened: boolean = false;
    public datePickersValidationRules: any = {
        startDate: {
            minDate: new Date(),
            maxDate: new Date()
        },
        endDate: {
            minDate: new Date(),
            maxDate: new Date()
        }
    };

    public selectedModuleName: string;
    public moduleNameList: Array<any> = [
       // { value: ModuleName.Core, selected: false, hidden: true },
        { value: ModuleName.ProjectAssignment, selected: false, hidden: false },
        { value: ModuleName.ATS, selected: false, hidden: false }];

    public isModuleConfigDisabled: boolean = true;

    constructor(private _companyHelper: CompanyHelper){

    }

    ngOnInit() {
        if (!this.moduleConfig) {
            this.currentModuleConfig = new ModuleConfig();
            this.isModuleConfigDisabled = false;
            this.isInAdd = true;
            this.currentModuleConfig.Name = this.moduleNameList[0].value;
        } else {
            this.currentModuleConfig = this.copyObject(this.moduleConfig);
        }

        let host: string = location.hostname;
        let companyName = this._companyHelper.getCompanyName(host);
        
        this.currentModuleConfig.CompanyName = companyName;
 
        this.moduleConfigForm = new FormGroup({
            name: new FormControl({ value: this.currentModuleConfig.Name, disabled: !this.isInEdit && !this.isInAdd }, Validators.required),
            startDate: new FormControl({ value: this.currentModuleConfig.StartDate, disabled: !this.isInEdit && !this.isInAdd }, Validators.required),
            endDate: new FormControl({ value: this.currentModuleConfig.EndDate, disabled: !this.isInEdit && !this.isInAdd })
        });

        let module = this.moduleNameList.find(x => x.value == this.currentModuleConfig.Name);
        if (module) {
            module.selected = true;
        }

        let today = new Date().setHours(0,0,0,0);
        let startDate = new Date(this.currentModuleConfig.StartDate).setHours(0,0,0,0);
        let endDate = new Date(this.currentModuleConfig.EndDate).setHours(0,0,0,0);
        
        if (this.currentModuleConfig.Name != ModuleName.Core &&
            (!this.currentModuleConfig.EndDate || (new Date(startDate) <= new Date(today) && new Date(endDate) > new Date(today)))) {
            this.canBeStopped = true;
        }
        
        if (!this.currentModuleConfig.EndDate || (new Date(endDate) >= new Date(today))) {
            this.canBeEditted = true;      
        }

        this.isCoreModule = this.isCore();
        this.isModuleStarted = this.isStarted();

        this.initDatePickers();        
    }

    private copyObject(source: any): any {
        if (!source) {
            return {};
        }

        return <ModuleConfig>JSON.parse(JSON.stringify(source));
    }

    private isCore(){
        return this.currentModuleConfig.Name == ModuleName.Core;
    }

    private isStarted(): boolean{
        let today = new Date().setHours(0,0,0,0);
        let startDate = new Date(this.currentModuleConfig.StartDate).setHours(0,0,0,0);

        return startDate <= today;
    }

    private initDatePickers(): void {
        let date: Date = new Date();
        
        if(this.currentModuleConfig.EndDate){
            this.datePickersValidationRules.startDate.maxDate = new Date(Date.parse(this.currentModuleConfig.EndDate.toString()));
        }else{
            this.datePickersValidationRules.startDate.maxDate = new Date(date.setFullYear(date.getFullYear() + 100));
        }

        if(this.currentModuleConfig.StartDate){
            this.datePickersValidationRules.endDate.minDate = new Date(Date.parse(this.currentModuleConfig.StartDate.toString()));
        }else{
            this.datePickersValidationRules.endDate.minDate = date;
        }

        this.datePickersValidationRules.endDate.maxDate = new Date(date.setFullYear(date.getFullYear() + 100));
    }

    public onModuleNameChanged(value) {
        this.currentModuleConfig.Name = value;
    }

    public openStartDatePicker(): void {
        this.isStartDatePickerOpened = !this.isStartDatePickerOpened;

        if (this.isStartDatePickerOpened) {
            this.isEndDatePickerOpened = false;

            this.setStartDateMaxDate();
        }
    }

    public openEndDatePicker(): void {
        this.isEndDatePickerOpened = !this.isEndDatePickerOpened;

        if (this.isEndDatePickerOpened) {
            this.isStartDatePickerOpened = false;

            this.setEndDateMinDate();
        }
    }

    private setStartDateMaxDate(): void {
        if (this.currentModuleConfig.EndDate) {
            this.datePickersValidationRules.startDate.maxDate = new Date(Date.parse(this.currentModuleConfig.EndDate.toString()));
        }
    }

    public setEndDateMinDate(): void {
        let today = new Date().setHours(0,0,0,0);
        let startDate = new Date(this.currentModuleConfig.StartDate).setHours(0,0,0,0);

        if(startDate < today){
            this.datePickersValidationRules.endDate.minDate = new Date(today);
        }else{
            this.datePickersValidationRules.endDate.minDate = new Date(Date.parse(this.currentModuleConfig.StartDate.toString()));
        }
    }

    public edit(): void {
        this.isInEdit = true;
        this.enableForm();
    }

    private enableForm(): void {
        this.moduleConfigForm.controls["name"].enable();
        this.isModuleConfigDisabled = false;
    }

    public stop(): void {
        this.stopConfirmDeleteModal.show(this.moduleConfig);
    }

    public onStop(moduleConfig: ModuleConfig): void {
        this.currentModuleConfig.EndDate = new Date();
        this.canBeStopped = false;
        this.save(true);
    }

    public cancel(): void {
        if (this.isInAdd) {
            this.operationCanceled.emit();
            return;
        }

        this.isInEdit = false;
        this.currentModuleConfig = this.copyObject(this.moduleConfig);

        this.disableForm();
    }

    public save(isStopped: boolean): void {
        if(isStopped || this.isModuleConfigValid(this.currentModuleConfig)){
            this.modifyModuleConfig.emit(this.currentModuleConfig);
            this.isInEdit = false;
            this.isInAdd = false;
            this.disableForm();
        }else{
            let message = "It is not possible to have two similar modules simultaneously. Module was not";

            if(!this.currentModuleConfig.Id){
                message += " created";
            }else{
                message += " updated";
            }

            this.operationFault.emit(message);
        }
    }

    private isModuleConfigValid(moduleConfig: ModuleConfig): boolean{
        let result: boolean = true;

        let newStartDate = new Date(moduleConfig.StartDate).setHours(0,0,0,0);
        let newEndDate = null;
        if(moduleConfig.EndDate){
            newEndDate = new Date(moduleConfig.EndDate).setHours(0,0,0,0);
        }

        for(let actualModule of this.actualModuleConfigs){
            let startDate = new Date(actualModule.StartDate).setHours(0,0,0,0);
            let endDate = null;
            if(actualModule.EndDate){
                endDate = new Date(actualModule.EndDate).setHours(0,0,0,0);
            } 

            if(actualModule.Name != moduleConfig.Name || (moduleConfig.Id && actualModule.Id == moduleConfig.Id)){
                continue;
            }

            if(new Date(startDate) < new Date(newStartDate)){
                if(!endDate || new Date(endDate) > new Date(newStartDate)){
                    return false;
                }
            }else if (new Date(startDate) > new Date(newStartDate)){
                if(!newEndDate || new Date(startDate) < new Date(newEndDate)){
                    return false;
                }
            }else{
                return false;
            }
        }

        return result;
    }

    private disableForm(): void {
        this.moduleConfigForm.controls["name"].disable();
        this.isModuleConfigDisabled = true;
    }

    public clearEndDatePicker(): void {
        this.currentModuleConfig.EndDate = null;
    }
}
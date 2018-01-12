import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver, Input, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { ModulesConfigService } from './services/module-config.service';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { ModuleConfig } from "./module-config";
import { ModuleConfigComponent } from "./module-config.component";
import { AlertType } from "../../common/alerts/alertType";
import { ModuleName } from "../../common/company/moduleName";
import { CompanyHelper } from "../../common/company/companyHelper";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'modules-config-list',
    templateUrl: 'modules-config-list.template.html',
    providers: [ModulesConfigService],
    outputs: ['coreModuleIsStopped']
})

export class ModulesConfigListComponent implements OnInit, OnChanges {
    @Input() companyName?: string;
    @ViewChild('addModuleTarget', { read: ViewContainerRef }) addModuleTarget;

    public coreModuleIsStopped = new EventEmitter<any>();

    public moduleConfigList: Array<ModuleConfig> = [];
    public actualModuleConfigs: Array<ModuleConfig> = [];
    public alerts: any = [];
    public isInAdd: boolean;
    public isLoading: boolean = true;
    public isGlobalConfig: boolean;
    public areAllModulesStopped: boolean;

    constructor(private _modulesConfigService: ModulesConfigService,
        private _authService: AuthService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _companyHelper: CompanyHelper) {
        
    }

    ngOnInit(){
        if(!this.companyName){
            let host: string = location.hostname;
            this.companyName = this._companyHelper.getCompanyName(host);
            this.isGlobalConfig = false;
        }else{
            this.isGlobalConfig = true;
        }

        this.getAll();
    }

    ngOnChanges(){
        this.isGlobalConfig = !!this.companyName;

        if(this.companyName && this.isInAdd){
            this.onOperationCanceled();
        }

        this.getAll();
    }

    public addRow(): void {
        let factory = this.componentFactoryResolver.resolveComponentFactory(ModuleConfigComponent);
        let componentRef = this.addModuleTarget.createComponent(factory);
        
        this.isInAdd = true;

        componentRef.instance.actualModuleConfigs = this.actualModuleConfigs;

        componentRef.instance.operationStarted.subscribe(val => {
            this.isLoading = true;
        });

        componentRef.instance.modifyModuleConfig.subscribe(val => {
            this.onModuleConfigModified(val);
        });

        componentRef.instance.operationCanceled.subscribe(val => {
            this.onOperationCanceled();
        });

        componentRef.instance.operationFault.subscribe(val => {
            this.showResult(false, val, AlertType.Error);
        });
    }

    public onOperationStarted(): void {
        this.isLoading = true;
    }

    public onOperationCompleted(event: any): void {
        this.showResult(event.wasOperationSucceed, event.message, event.type);

        if (event.wasOperationSucceed) {
            this.getAll();
        }
    }

    public onOperationFault(event: any): void {
        this.showResult(false, event, AlertType.Error);
    }

    private onOperationCanceled(): void{
        this.addModuleTarget.remove();
        this.isInAdd = false;
    }

    public onModuleConfigModified(moduleConfig: ModuleConfig) {
        this.isLoading = true;
        moduleConfig.CompanyName = this.companyName;

        if (!moduleConfig.Id) {
            this.create(moduleConfig);
        } else {
            this.update(moduleConfig);
        }

        this.getAll();
    }
    
    private create(moduleConfig: ModuleConfig) {
        this.isLoading = false;

        this._modulesConfigService.create(moduleConfig)
            .subscribe(result => {
                this.isLoading = false;
                if (result) {
                    this.showResult(true, "Module was created successfully. Changes will be applied in 5 minutes", AlertType.Success);
                   
                } else {
                    this.showResult(false, "Module was not created", AlertType.Error);
                }
            }, error => this.handleError(error));

             
    }

    private update(moduleConfig: ModuleConfig) {
        this.alerts = [];
        this._modulesConfigService.update(moduleConfig)
            .subscribe(result => {
                this.isLoading = false;
                if(result){
                    this.showResult(true, "Module was updated successfully. Changes will be applied in 5 minutes", AlertType.Success);
                    this.getAll();
                }else{
                    this.showResult(false, "Module was not updated", AlertType.Error);
                }                
            }, error => this.handleError(error));
    }

    public showOldModules(showOld: boolean): void{
        this.getAll(showOld);
    }

    public getAll(showOld: boolean = false): Array<ModuleConfig> {
        this.moduleConfigList = [];
        
        let that = this;
        this._modulesConfigService.getAll(showOld, this.companyName)
            .subscribe(response => {
                that.moduleConfigList = response;
                that.isLoading = false;
                that.isInAdd = false;

                if(!showOld){
                    that.actualModuleConfigs = that.moduleConfigList;
                }

                that.areAllModulesStopped = that.ifAllModulesStopped();
            }
            , error => this.handleError(error));

        return this.moduleConfigList;
    }

    public ifAllModulesStopped(): boolean{
        let coreModule = this.moduleConfigList.find(x => x.Name == "Core");
        
        let ifAllModulesStopped = coreModule && !!coreModule.EndDate;

        if(ifAllModulesStopped){
            this.onCoreModuleIsStopped();
        }

        return ifAllModulesStopped;
    }

    public onCoreModuleIsStopped(): void{
        this.coreModuleIsStopped.emit({});
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody = JSON.parse(error._body);
            if (errorBody.Message) {
                errorMessage = errorBody.Message;
            } else {
                errorMessage = errorBody;
            }
        }

        if (error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
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
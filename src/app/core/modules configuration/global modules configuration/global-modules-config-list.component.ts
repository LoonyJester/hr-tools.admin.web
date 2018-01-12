import { Component, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ModulesConfigService } from '../services/module-config.service';
import { StopModuleConfirmationModalComponent } from '../modals/stop-module-confirmation.component';
import { ModuleConfig } from "../module-config";
import { ModulesConfigListComponent } from "../modules-config-list.component";
import { AlertType } from "../../../common/alerts/alertType";
import { ModuleName } from "../../../common/company/moduleName";
import { AuthService } from '../../../common/authorization/services/auth.service';

@Component({
    selector: 'global-modules-config-list',
    templateUrl: 'global-modules-config-list.template.html',
    providers: [ModulesConfigService]
})

export class GlobalModulesConfigListComponent {
    @ViewChild(ModulesConfigListComponent) modulesConfigListComponent: ModulesConfigListComponent
    @ViewChild(StopModuleConfirmationModalComponent) stopConfirmDeleteModal: StopModuleConfirmationModalComponent

    public companyName: string;
    public companyDisplayName: string;
    public companyList: Array<any> = [{
        Value: "teaminternational",
        Name: "Team International"
    }, {
        Value: "company",
        Name: "Some Company"
    }];
    public alerts: any = [];
    public isLoading: boolean = true;
    public areAllModulesStopped: boolean;

    constructor(
        private _modulesConfigService: ModulesConfigService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _authService: AuthService) {
            this.companyName = this.companyList[0].Value;
            this.companyDisplayName = this.companyList[0].Name;            
    }

    // ngOnChanges(){
    //     debugger;
    //     this.areAllModulesStopped = this.modulesConfigListComponent.ifAllModulesStopped();
    // }

    public onCoreModuleIsStopped(){
        this.areAllModulesStopped = true;
    }

    public getCompanyDisplayName(): string{
        let company = this.companyList.find(x => x.Value == this.companyName);
        
        return company.Name;
    }

    public stopAll(){
        this.stopConfirmDeleteModal.show();
    }

    public onStopAll(){
        this.alerts = [];
        this._modulesConfigService.stopAll(this.companyName)
            .subscribe(result => {
                this.isLoading = false;
                if(result){
                    this.showResult(true, "All modules were successfully stopped. Changes will be applied in 5 minutes", AlertType.Success);                    
                }else{
                    this.showResult(false, "Modules were not stopped", AlertType.Error);
                }

                this.modulesConfigListComponent.addModuleTarget.remove();
                this.modulesConfigListComponent.getAll();
            }, error => this.handleError(error));        
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
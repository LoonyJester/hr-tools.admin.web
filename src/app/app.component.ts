import { Component, ViewEncapsulation, ViewContainerRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AppState } from './app.service';
import { AuthService } from './common/authorization/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlHelper } from "./common/company/urlHelper";
import { CompanyHelper } from "./common/company/companyHelper";
import { ConfigurationService } from './common/company/services/configuration.service';
import { ModuleName } from "./common/company/moduleName";
import { Router } from "@angular/router";

@Component({
    selector: 'app',
    encapsulation: ViewEncapsulation.None,
    styleUrls: [
        './app.style.css'
    ],
    templateUrl: 'app.template.html',
    providers: [ConfigurationService]
})

export class AppComponent implements OnInit{
    public activeModulesConfiguration: Array<string>;
    public isCoreModuleActive: boolean;
    public showLoginPage: boolean = false;

    private stylesUrl: string;
    private secureUrl: any;
    private isHorizontalMenuOpened: boolean = true;

    constructor(public viewContainerRef: ViewContainerRef,
        private _configurationService: ConfigurationService,
        private router: Router,
        public appState: AppState,
        private sanitizer: DomSanitizer,
        private _urlHelper: UrlHelper,
        private _companyHelper: CompanyHelper,
        private _location: Location,
        private _authService: AuthService) {
    }

    ngOnInit(){
        this.initActiveModulesConfiguration();
        
        let isUserLoggedIn = this._authService.isUserLoggedIn();
        if(!isUserLoggedIn){
            this.showLoginPage = true;
            this.router.navigateByUrl('/Login');
        }else{
            this.showLoginPage = false;
        }       
    }

    private initActiveModulesConfiguration(): void{
        let that = this;

        this._configurationService.getActiveModulesConfiguration()
            .subscribe(response => {
                this.activeModulesConfiguration = new Array<string>()
                
                let isCoreModuleActive = this.isModuleActive(response, ModuleName.Core);
                let isPAModuleActive = this.isModuleActive(response, ModuleName.ProjectAssignment);
                let isATSModuleActive = this.isModuleActive(response, ModuleName.ATS);

                if(isCoreModuleActive){
                    that.isCoreModuleActive = true;
                    that.activeModulesConfiguration.push(ModuleName.Core);

                    if(isPAModuleActive){
                        that.activeModulesConfiguration.push(ModuleName.ProjectAssignment);
                    }

                    if(isATSModuleActive){
                        that.activeModulesConfiguration.push(ModuleName.ATS);
                    }
                }else{
                    that.isCoreModuleActive = false;
                }
            }
            , error => { debugger; });
    }

    private isModuleActive(activeModules: Array<string>, moduleName: ModuleName): boolean{
        if(!activeModules){
            return false;
        }
        
        return activeModules.some(x => x == moduleName);
    }

    public onMenuToggled(event) {
        this.isHorizontalMenuOpened = event;
    }

    public onLoginClicked(event){
        debugger;
        this.showLoginPage = true;
        //location.replace('/');
        //this._location.replaceState('/');
        this.router.navigate(['Login']);
    }

    public onUserLoggedIn(){
        debugger;
        location.reload();
    }
}
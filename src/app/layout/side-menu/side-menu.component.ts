import { Component, Input, OnChanges } from '@angular/core';
import { AuthService } from '../../common/authorization/services/auth.service';
import { User } from '../../common/authorization/user';
import { DomSanitizer } from '@angular/platform-browser';
import { UrlHelper } from "../../common/company/urlHelper";
import { CompanyHelper } from "../../common/company/companyHelper";
import { ModuleName } from "../../common/company/moduleName";

@Component({
    selector: 'side-menu',
    templateUrl: 'side-menu.template.html',
    styleUrls: ['./side-menu.style.css']
})

export class SideMenuComponent implements OnChanges {
    public isHomeMenuItemActive: boolean = false;
    public isHRMenuItemActive: boolean = false;
    public isCoreModuleActive: boolean = false;
    public isProjectAssignmentMenuItemActive: boolean = false;
    public isPAModuleActive: boolean = false;
    public isATSMenuItemActive: boolean = false;
    public isATSModuleActive: boolean = false;
    public isReportsMenuItemActive: boolean = false;
    public isConfigMenuItemActive: boolean = false;
    public isUserLoggedIn: boolean = false;
    
    public userName: string;
    
    private stylesUrl: string;
    private secureUrl: any;
    private apiUrl: string;

    @Input()
    isOpened: boolean = false;

    @Input()
    activeModules: Array<string>;

    constructor(
        private _authService: AuthService,
        private sanitizer: DomSanitizer,
        private _urlHelper: UrlHelper,
        private _companyHelper: CompanyHelper) {

        this.userName = this.getUserName(); 

        this.isUserLoggedIn = this._authService.isUserLoggedIn();

        let host: string = location.hostname;
        this.stylesUrl = "app/layout/side-menu/side-menu." + this._companyHelper.getCompanyName(host) + ".style.css";
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.stylesUrl);
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    ngOnChanges(){
        this.getActiveModulesConfiguration();
    }

    private getUserName(): string{
        let authDataSerialized = localStorage.getItem("authorizationData");
        if(!authDataSerialized){
            return "";
        }

        let authData = JSON.parse(authDataSerialized);

        return authData.userNameDisplay;
    }

    public closeAllMenuItems(): void {
        this.isHomeMenuItemActive = false;
        this.isHRMenuItemActive = false;
        this.isProjectAssignmentMenuItemActive = false;
        this.isATSMenuItemActive = false;
        this.isReportsMenuItemActive = false;
        this.isConfigMenuItemActive = false;
    }

    public isUserInRole(roles: Array<string>): boolean {
        //return this._authService.isUserLoggedIn() && this._authService.isUserInRole(roles);
        return this._authService.isUserInRole(roles);
    } 

    private getActiveModulesConfiguration(){
        if(!this.activeModules || this.activeModules.length == 0){
            return;
        }

        let coreModule = this.activeModules.find(x => x == ModuleName.Core);

        if(coreModule){
            this.isCoreModuleActive = true;
        }else{
            this.isCoreModuleActive = false;
        }

        let paModule = this.activeModules.find(x => x == ModuleName.ProjectAssignment);

        if(paModule){
            this.isPAModuleActive = true;
        }else{
            this.isPAModuleActive = false;
        }

        let atsModule = this.activeModules.find(x => x == ModuleName.ATS);

        if(atsModule){
            this.isATSModuleActive = true;
        }else{
            this.isATSModuleActive = false;
        }
    }

    private isModuleActive(activeModules: Array<string>, moduleName: ModuleName): boolean{
        if(!activeModules){
            return false;
        }
        
        return activeModules.some(x => x == moduleName);
    }
}
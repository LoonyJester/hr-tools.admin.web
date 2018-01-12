import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ModuleConfig } from '../module-config';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";

@Injectable()
export class ModulesConfigService {
    private apiUrl;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    public getAll(showOld: boolean = false, companyName: string): Observable<Array<ModuleConfig>> {
        let headers: Headers = this._authService.getHeaders();
        
        if(!companyName){
            companyName = null;
        }

        return this._http.get(this.apiUrl + 'Api/GetModulesConfiguration?showOld=' + showOld + '&companyName=' + companyName, {
            headers: headers
        }).map(res => {
            let result = new Array<ModuleConfig>();
            let jsonRes = res.json();

            result = jsonRes.map(this.mapBEToModuleConfig);

            return result;
        });
    }

    public create(moduleConfig: ModuleConfig): Observable<boolean> {
        let beModel: any = this.mapModuleConfigToBE(moduleConfig);
        const body: string = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateModuleConfiguration', body, {
            headers: headers
        }).map(res => res.json());
    }

    public update(moduleConfig: ModuleConfig): Observable<boolean> {
        let beModel: any = this.mapModuleConfigToBE(moduleConfig);
        const body: string = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateModuleConfiguration', body, {
            headers: headers
        }).map(res => res.json());
    }

    public stopAll(companyName: string): Observable<boolean>{
        let beModel: any = companyName;
        const body: string = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/StopAllModuleConfigurations', body, {
            headers: headers
        }).map(res => res.json());
    }

    private mapBEToModuleConfig(moduleConfig: any): ModuleConfig {
        let result = new ModuleConfig();

        result.Id = moduleConfig.Id;
        result.CompanyName = moduleConfig.CompanyName;
        result.ClientId = moduleConfig.ClientId;
        result.Name = moduleConfig.ModuleName;
        result.StartDate = moduleConfig.StartDate;
        result.EndDate = moduleConfig.EndDate;

        return result;
    }

    private mapModuleConfigToBE(moduleConfig: ModuleConfig): any {
        let result: any = {};

        result.Id = moduleConfig.Id;
        result.CompanyName = moduleConfig.CompanyName;
        result.ClientId = moduleConfig.ClientId;
        result.ModuleName = moduleConfig.Name;

        let startDate = new Date(moduleConfig.StartDate);
        startDate.setHours(startDate.getHours() - startDate.getTimezoneOffset() / 60);
        result.StartDate = startDate;

        if(moduleConfig.EndDate){
            let endDate = new Date(moduleConfig.EndDate);        
            endDate.setHours(endDate.getHours() - endDate.getTimezoneOffset() / 60);
            result.EndDate = endDate;
        }        

        return result;
    }
}
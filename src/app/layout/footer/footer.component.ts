import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyHelper } from "../../common/company/companyHelper";

@Component({
    selector: 'custom-footer',
    templateUrl: 'footer.html',
    styleUrls: ['./footer.style.css']
})

export class FooterComponent {
    private companyDisplayName: string;
    private companyUrl: string;
    private stylesUrl: string;
    private secureUrl: any;

    constructor(private sanitizer: DomSanitizer,
        private _companyHelper: CompanyHelper) {

        let host: string = location.hostname;
        let companyName = this._companyHelper.getCompanyName(host);
        this.stylesUrl = "app/layout/footer/footer." + companyName + ".style.css";
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.stylesUrl);
        this.companyDisplayName = this._companyHelper.getCompanyDisplayName(host);
        this.companyUrl = this._companyHelper.getCompanyUrl(host);
    }
}
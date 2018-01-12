import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CompanyHelper } from "../../common/company/companyHelper";

@Component({
    selector: 'top-nav-menu',
    templateUrl: 'top_nav_menu.template.html',
    styleUrls: ['./top_nav_menu.style.css'],
    outputs: ['menuToggled', 'loginClicked']
})

export class TopNavigaitonMenuComponent {
    @Input() isCoreModuleActive: boolean;
    public isHorizontalMenuOpened: boolean = true;
    public menuToggled = new EventEmitter<any>();
    public loginClicked = new EventEmitter<any>();

    private stylesUrl: string;
    private secureUrl: any;

    constructor(private sanitizer: DomSanitizer,
        private companyHelper: CompanyHelper) {
        let host: string = location.hostname;
        this.stylesUrl = "app/layout/top navigation menu/top_nav_menu." + this.companyHelper.getCompanyName(host) + ".style.css";
        this.secureUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.stylesUrl);
    }

    public toggleMenu(): void {
        this.isHorizontalMenuOpened = !this.isHorizontalMenuOpened;

        this.menuToggled.emit(this.isHorizontalMenuOpened);
    }

    public onLoginClicked(event){
        this.loginClicked.emit();
    }
}
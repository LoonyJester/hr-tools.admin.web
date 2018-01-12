import { NgModule } from '@angular/core';

import { TopNavigationMenuModule } from './top navigation menu/top_nav_menu.module';
import { SideMenuModule } from "./side-menu/side-menu.module";
import { FooterModule } from "./footer/footer.module";
import { LandingPageComponent } from "./landing page/landing-page.component";
import { NoContentComponent } from "./no-content/no-content.component";
import { BrowserModule } from '@angular/platform-browser';

import * as moment from 'moment';

@NgModule({
    declarations: [
        LandingPageComponent,
        NoContentComponent
    ],
    imports: [
        BrowserModule       
    ],
    exports: [
        TopNavigationMenuModule,
        SideMenuModule,
        FooterModule
    ]
})
export class LayoutModule {
}

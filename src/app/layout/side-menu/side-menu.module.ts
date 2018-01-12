import { NgModule } from '@angular/core';
import { SideMenuComponent } from "./side-menu.component";
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from '../../app.routes';

@NgModule({
  declarations: [
    SideMenuComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  exports: [
    SideMenuComponent
  ]
})
export class SideMenuModule {
}

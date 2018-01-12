import { NgModule } from '@angular/core';
import { TopNavigaitonMenuComponent } from "./top_nav_menu.component";
import { LoginAreaComponent } from './login area/login-area.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from '../../app.routes';

@NgModule({
  declarations: [
    TopNavigaitonMenuComponent,
    LoginAreaComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  exports: [
      TopNavigaitonMenuComponent,
      LoginAreaComponent
  ]
})
export class TopNavigationMenuModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from '../../app.routes';
import { FooterComponent } from "./footer.component";

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  exports: [
      FooterComponent
  ]
})
export class FooterModule {
}

import { NgModule, TemplateRef } from '@angular/core';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';

import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { CoreModule } from './core/core.module';
import { ProjectAssignmentModule } from './project assignment/project-assignment.module';
import { LayoutModule } from './layout/layout.module';
import { AuthModule } from './common/authorization/auth.module';
import { IsUserHasAdminRoleGuard } from './common/guards/isUserHasAdminRoleGuard';

import { FormsModule } from '@angular/forms';

import { ENV_PROVIDERS } from './environment';
import * as moment from 'moment';

// Application wide providers
const APP_PROVIDERS = [
  //...APP_RESOLVER_PROVIDERS,
  AppState,
  TemplateRef
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),

    CoreModule,
    ProjectAssignmentModule,
    LayoutModule,
    AuthModule
  ],
  providers: [
    //ENV_PROVIDERS,
    APP_PROVIDERS,
    IsUserHasAdminRoleGuard
  ]
})
export class AppModule {
}

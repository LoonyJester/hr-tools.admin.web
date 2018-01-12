import { NgModule } from '@angular/core';

import { ModuleConfigComponent } from './module-config.component';
import { ModulesConfigListComponent } from './modules-config-list.component';
import { GlobalModulesConfigListComponent } from './global modules configuration/global-modules-config-list.component';
import { StopModuleConfirmationModalComponent } from './modals/stop-module-confirmation.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { StopModuleConfirmationModule } from './modals/stop-module-confirmation.module';

import * as moment from 'moment';

@NgModule({
  declarations: [
    ModuleConfigComponent,
    ModulesConfigListComponent,
    GlobalModulesConfigListComponent
  ],
  entryComponents: [ModuleConfigComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    MultiselectDropdownModule,
    StopModuleConfirmationModule
  ]
})

export class ConfigurationModule{

}
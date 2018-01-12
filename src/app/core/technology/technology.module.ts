import { NgModule } from '@angular/core';

import { TechnologyListComponent } from './technology-list.component';
import { TechnologyComponent } from './technology.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { DeleteConfirmationModule } from '../../common/modals/delete confirmation/delete-confirmation.module';

import * as moment from 'moment';

@NgModule({
  declarations: [
    TechnologyListComponent,
    TechnologyComponent
  ],
  entryComponents: [TechnologyComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    DeleteConfirmationModule
  ]
})
export class TechnologyModule {
}

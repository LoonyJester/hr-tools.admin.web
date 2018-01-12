import { NgModule } from '@angular/core';

import { JobTitleListComponent } from './job-title-list.component';
import { JobTitleComponent } from './job-title.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { DeleteConfirmationModule } from '../../common/modals/delete confirmation/delete-confirmation.module';

import * as moment from 'moment';

@NgModule({
  declarations: [
    JobTitleListComponent,
    JobTitleComponent
  ],
  entryComponents: [JobTitleComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    DeleteConfirmationModule
  ]
})
export class JobTitleModule {
}

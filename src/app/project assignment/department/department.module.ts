import { NgModule } from '@angular/core';

import { DepartmentListComponent } from './department-list.component';
import { DepartmentComponent } from './department.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { DeleteConfirmationModule } from '../../common/modals/delete confirmation/delete-confirmation.module';

import * as moment from 'moment';

@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentComponent
  ],
  entryComponents: [DepartmentComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    SelectModule,
    MultiselectDropdownModule,
    DeleteConfirmationModule
  ]
})
export class DepartmentModule {
}

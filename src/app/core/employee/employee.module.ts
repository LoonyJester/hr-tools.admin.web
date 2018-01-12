import { NgModule } from '@angular/core';

import { EmployeeListComponent } from './employee-list.component';
import { AddEditEmployeeModalComponent } from './modals/addEdit/addEditEmployeeModal.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { Ng2CompleterModule } from "ng2-completer";
import { TextMaskModule } from 'angular2-text-mask';
import { FileUploadModule } from 'ng2-file-upload';
import { GridModule } from '../../common/grid/grid.module';
import { DeleteConfirmationModule } from '../../common/modals/delete confirmation/delete-confirmation.module';

import * as moment from 'moment';

@NgModule({
  declarations: [
    EmployeeListComponent,
    AddEditEmployeeModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    PaginationModule,
    SelectModule,
    MultiselectDropdownModule,
    Ng2CompleterModule,
    TextMaskModule,
    FileUploadModule,
    GridModule,
    DeleteConfirmationModule
  ]
})
export class EmployeeModule {
}

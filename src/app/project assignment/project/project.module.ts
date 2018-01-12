import { NgModule } from '@angular/core';

import { ProjectListComponent } from './project-list.component';
import { AddEditProjectModalComponent } from './modals/addEdit/addEditProjectModal.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';
import { DeleteConfirmationModule } from '../../common/modals/delete confirmation/delete-confirmation.module';
import { GridModule } from '../../common/grid/grid.module';

import * as moment from 'moment';

@NgModule({
  declarations: [
    ProjectListComponent,
    AddEditProjectModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    PaginationModule,
    SelectModule,
    MultiselectDropdownModule,
    DeleteConfirmationModule,
    GridModule
  ]
})
export class ProjectModule {
}

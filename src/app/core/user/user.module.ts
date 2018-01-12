import { NgModule } from '@angular/core';

import { UserListComponent } from './user-list.component';
import { UserComponent } from './user.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { MultiselectDropdownModule } from '../../common/multiselect-dropdown/multiselect-dropdown';

import * as moment from 'moment';

@NgModule({
  declarations: [
    UserListComponent,
    UserComponent
  ],
  entryComponents: [UserComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,//.forRoot(),
    SelectModule,
    MultiselectDropdownModule
  ]
})
export class UserModule {
}

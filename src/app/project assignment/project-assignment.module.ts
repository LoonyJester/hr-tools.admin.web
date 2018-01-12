import { NgModule } from '@angular/core';

import { ProjectModule } from "./project/project.module";
import { DepartmentModule } from "./department/department.module";

import { UserService } from '../common/authorization/services/user.service';
import { AuthService } from '../common/authorization/services/auth.service';
import { UrlHelper } from "../common/company/urlHelper";
import { CompanyHelper } from "../common/company/companyHelper";

import * as moment from 'moment';

@NgModule({
  imports: [
    ProjectModule,
    DepartmentModule
  ],
  providers: [
    UserService,
    AuthService,
    UrlHelper,
    CompanyHelper
  ]
})
export class ProjectAssignmentModule {
}

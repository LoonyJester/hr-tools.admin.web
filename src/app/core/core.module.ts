import { NgModule } from '@angular/core';
import { EmployeeModule } from "./employee/employee.module";
import { UserModule } from "./user/user.module";
import { JobTitleModule } from "./job title/jobTitle.module";
import { TechnologyModule } from "./technology/technology.module";
import { ConfigurationModule } from "./modules configuration/configuration.module";

import * as moment from 'moment';

@NgModule({
  imports: [
    EmployeeModule,
    UserModule,
    JobTitleModule,
    TechnologyModule,
    ConfigurationModule
  ]
})

export class CoreModule {
}

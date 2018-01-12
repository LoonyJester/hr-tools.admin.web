import { Routes } from '@angular/router';
import { LandingPageComponent } from './layout/landing page/landing-page.component';
import { EmployeeListComponent } from "./core/employee/employee-list.component";
import { UserListComponent } from "./core/user/user-list.component";
import { JobTitleListComponent } from "./core/job title/job-title-list.component";
import { TechnologyListComponent } from "./core/technology/technology-list.component";
import { ProjectListComponent } from "./project assignment/project/project-list.component";
import { DepartmentListComponent } from "./project assignment/department/department-list.component";
import { LoginComponent } from "./common/authorization/login/login.component";
import { LoginAreaComponent } from "./layout/top navigation menu/login area/login-area.component";
import { ModulesConfigListComponent } from "./core/modules configuration/modules-config-list.component";
import { GlobalModulesConfigListComponent } from "./core/modules configuration/global modules configuration/global-modules-config-list.component";
import { NoContentComponent } from './layout/no-content/no-content.component';
import { IsUserHasAdminRoleGuard } from './common/guards/isUserHasAdminRoleGuard';

export const ROUTES: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'EmployeeList',  component: EmployeeListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  { path: 'UserList', component: UserListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  { path: 'JobTitles',  component: JobTitleListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  { path: 'Technologies', component: TechnologyListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  { path: 'Projects', component: ProjectListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  { path: 'Departments', component: DepartmentListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  // { path: 'Login', component: LoginComponent },
  { path: 'LoginArea', component: LoginAreaComponent },
  { path: 'ModulesConfig', component: ModulesConfigListComponent, canActivate: [IsUserHasAdminRoleGuard] },
  { path: 'GlobalModulesConfig', component: GlobalModulesConfigListComponent },

  { path: '**', component: NoContentComponent },
];

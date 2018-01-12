import { NgModule } from '@angular/core';
import { StopModuleConfirmationModalComponent } from './stop-module-confirmation.component';
import { ModalModule } from 'ng2-bootstrap';

@NgModule({
  declarations: [
    StopModuleConfirmationModalComponent
  ],
  imports: [
    ModalModule//.forRoot()
  ],
  exports: [
    StopModuleConfirmationModalComponent
  ]
})
export class StopModuleConfirmationModule {
}

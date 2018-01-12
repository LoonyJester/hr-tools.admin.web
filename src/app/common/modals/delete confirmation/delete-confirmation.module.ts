import { NgModule } from '@angular/core';
import { DeleteConfirmationModalComponent } from './delete-confirmation.component';
import { ModalModule } from 'ng2-bootstrap';

@NgModule({
  declarations: [
    DeleteConfirmationModalComponent
  ],
  imports: [
    ModalModule//.forRoot() //!
  ],
  exports: [
    DeleteConfirmationModalComponent
  ]
})
export class DeleteConfirmationModule {
}

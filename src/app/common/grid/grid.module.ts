import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';
import { BrowserModule } from '@angular/platform-browser';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Ng2TableModule } from "ng2-table";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PaginationModule,//.forRoot(), // !
    Ng2TableModule
  ],
  exports: [
    GridComponent
  ]
})
export class GridModule {
}

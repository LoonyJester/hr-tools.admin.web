import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

@NgModule({
  imports: [CommonModule, BrowserModule, FormsModule, ReactiveFormsModule,],
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent]
})
export class AuthModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';
import { ModalformModule} from '../app/core/modalform/modalform.module';
import { SharedModule } from './shared/shared.module';
import { CanActivateGuard } from '../app/customer/can-activate.guard';
import {NglModule} from 'ng-lightning/ng-lightning';
import { ImageUploadModule } from 'angular2-image-upload';
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';


import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    LoginModule,          // Eager loaded since we may need to go here right away as browser loads based on route user enters
    AppRoutingModule,     // Main routes for application
    CoreModule,           // Singleton objects (services, components that are loaded only once, etc.)
    SharedModule,          // Shared (multi-instance) objects
    FormsModule,
    ReactiveFormsModule,
    ImageUploadModule.forRoot(),
    NglModule.forRoot(),
    FancyImageUploaderModule
  ],
  providers: [CanActivateGuard],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

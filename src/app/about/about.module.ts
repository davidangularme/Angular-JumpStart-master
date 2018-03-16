import { NgModule } from '@angular/core';

import { AboutRoutingModule } from './about-routing.module';

import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports:      [ ReactiveFormsModule, SharedModule, AboutRoutingModule ],
  declarations: [ AboutRoutingModule.components ]
})
export class AboutModule { }






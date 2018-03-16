import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import {NglModule} from 'ng-lightning/ng-lightning';

@NgModule({
  imports: [CustomerRoutingModule, SharedModule, NglModule],
  declarations: [CustomerRoutingModule.components]
})
export class CustomerModule { }

import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CustomersRoutingModule } from './customers-routing.module';
import {NglModule} from 'ng-lightning/ng-lightning';

@NgModule({
  imports: [CustomersRoutingModule, SharedModule , NglModule],
  declarations: [CustomersRoutingModule.components]
})
export class CustomersModule { }

import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { ModalformComponent} from './../core/modalform/modalform.component';
import { SharedModule } from '../shared/shared.module';
import { OrdersRoutingModule } from './orders-routing.module';
import {NglModule} from 'ng-lightning/ng-lightning';
import { FormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { FancyImageUploaderModule } from 'ng2-fancy-image-uploader';
import {DetailsUploadComponent} from '../upload/details-upload/details-upload.component';
import {FormUploadComponent} from '../upload/form-upload/form-upload.component';
import {ListUploadComponent} from '../upload/list-upload/list-upload.component';
import {UploadFileService} from '../upload/upload-file.service';


@NgModule({
  imports: [SharedModule, OrdersRoutingModule , FormsModule , ImageUploadModule.forRoot(), NglModule.forRoot() , FancyImageUploaderModule ],
  declarations: [OrdersRoutingModule.components ,
    DetailsUploadComponent,
    FormUploadComponent,
    ListUploadComponent
  ],
  providers : [ModalformComponent , UploadFileService ]
})
export class OrdersModule { }

import { Component, OnInit , ViewChildren , TemplateRef } from '@angular/core';

import { DataService } from '../core/services/data.service';
import { ICustomer, IPagedResults } from '../shared/interfaces';
import { TrackByService } from '../core/services/trackby.service';
import { ModalformComponent } from '../core/modalform/modalform.component';
import {NglConfig} from 'ng-lightning/ng-lightning';
import {} from 'ng-lightning/modals';
import { User } from './user.interface';
import { FancyImageUploaderOptions, UploadedFile } from 'ng2-fancy-image-uploader';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError, map} from 'rxjs/operators';


@Component({
    selector: 'cm-customers-orders',
    templateUrl: './orders.component.html',
    styleUrls: [ './orders.component.css' ]
})
export class OrdersComponent implements OnInit {


  netImage: any = './static/file-1521131652920.jpeg';
  options: FancyImageUploaderOptions = {
    thumbnailHeight: 50,
    thumbnailWidth: 50,
    uploadUrl: '/upload',
    allowedImageTypes: ['image/png', 'image/jpeg'],
    maxImageSize: 3000,
    withCredentials: false
  };
  url;
  public user: User;
  opened = false;
  selected = true;
  size: string;
  public selectedFiles;
  noHeader = false;
  noFooter = false;
  directional = false;

  customers: ICustomer[];
    totalRecords = 0;
    pageSize = 5;

    constructor( private dataService: DataService, private http: HttpClient ,
         private trackbyService: TrackByService , private config: NglConfig) { }

  onUpload(file: UploadedFile) {
    console.log("sdls;dls;ld;");
    console.log(file);
  }
/*
  getImagenew(): Observable< object > {
    return  this.http.post('/getfilename');

  }*/

  getImagenew(): Observable<HttpEvent<{}>> {
    const req = new HttpRequest('POST', '/getfilename', null, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req).map(res => {
      return res ;
    });

  }

  getImage() {
    this.getImagenew().subscribe(res => {
      if (typeof res['body'] === 'undefined') {
        console.log(name + ' is undefined');
      } else {
        let str = res['body'] ;
        str = str.substring(1, str.length - 1);
        this.netImage = './static/' + str;
        console.log(this.netImage);
      }
    });
  }
  change() {
    this.selected = !this.selected;

  }

    ngOnInit() {
        this.getCustomersPage(1);
      this.user = {
        name: '',
        address: {
          street: '',
          postcode: '8000'
        }
      };
    }

  save(model: User, isValid: boolean) {
    this.getImage();
    console.log(model, isValid);
    this.opened = false;
  }

  open(size?: string) {
    this.size = size;
    this.opened = !this.opened;
  }

  cancel() {
    this.opened = false;
  }
    pageChanged(page: number) {
        this.getCustomersPage(page);
    }

    getCustomersPage(page: number) {
        this.dataService.getCustomersPage((page - 1) * this.pageSize, this.pageSize)
            .subscribe((response: IPagedResults<ICustomer[]>) => {
                this.totalRecords = response.totalRecords;
                this.customers = response.results;
            });
    }

}

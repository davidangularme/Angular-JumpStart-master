import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ResponseContentType} from '@angular/http';
import {async} from 'rxjs/scheduler/async';
import {headersToString} from 'selenium-webdriver/http';
import {ContentType} from '@angular/http/src/enums';

@Injectable()
export class UploadFileService {

  constructor(private http: HttpClient) {}

  pushFileToStorage(file: File): Observable<HttpEvent<{}>> {
    let formdata: FormData = new FormData();

    formdata.append('file', file);
    console.log('aaaaaaaa');
    console.log(formdata);

    const req = new HttpRequest('POST', '/upload', formdata, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  getFiles(): Observable< any > {
  //  return this.http.get('/getimage') ;

    return  this.http.get('/getimage');
  }




}

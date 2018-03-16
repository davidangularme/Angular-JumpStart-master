import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {UploadFileService} from '../upload-file.service';

@Component({
  selector: 'list-upload',
  templateUrl: './list-upload.component.html',
  styleUrls: ['./list-upload.component.css']
})
export class ListUploadComponent implements OnInit {

  showFile = false
  fileUploads: Observable<string[]>

  constructor(private uploadService: UploadFileService) {}

  ngOnInit() {
  }

  showFiles(enable: boolean) {
    this.showFile = true

    if (true) {
      console.log('fffffff');
      //this.fileUploads = this.uploadService.getFiles();
      console.log(this.uploadService.getFiles().subscribe(data => {console.log(data); this.fileUploads = data ; } ));
    }
  }
}

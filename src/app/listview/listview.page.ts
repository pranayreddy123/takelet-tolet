import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-listview',
  templateUrl: './listview.page.html',
  styleUrls: ['./listview.page.scss'],
})
export class ListviewPage implements OnInit {
  public image : any;
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.http.get('http://localhost:8080/getLocations')
      .subscribe(data => {
        let objectURL = 'data:image/png;base64,' + data;
        this.image = this.sanitizer.bypassSecurityTrustUrl(objectURL); 
        
      }, error => {
        console.log(error);
      });
  
    }
}
 
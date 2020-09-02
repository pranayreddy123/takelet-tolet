import { ChangeDetectorRef,Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgForm } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { NgStyle } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {LoadingController, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-postadd',
  templateUrl: './postadd.page.html',
  styleUrls: ['./postadd.page.scss'],
})

export class PostaddPage implements OnInit {
  // Readable Address
  address: string;
  adInfo: any;
  file: any;
  public myPhoto: any;
  public error: string;
  private loading: any;

  // Location coordinates
  latitude: number;
  longitude: number;
  accuracy: number;

  constructor(private http: HttpClient, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private readonly changeDetectorRef: ChangeDetectorRef,  private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController) { }
  ngOnInit() {
    this.adInfo = { latitude: "", longitude: "", imageBlob: Blob };
    this.getGeolocation();
  }



  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  createAd(form: NgForm) {
    alert(form.value.mrent);
    var postData = {
      "firstName": form.value.fName,
      "lastName": form.value.lName,
      "email": form.value.email,
      "phoneNumber": form.value.phoneNumber,
      "address": form.value.address,
      "postalCode": form.value.postalCode,
      "monthRent": form.value.mrent,
      "depositAmount": form.value.deposit,
      "description": form.value.description,
      "latitude": this.adInfo.latitude,
      "longitude": this.adInfo.longitude

    }




    var formData = new FormData();
    formData.append('file', this.file);
    formData.append('location', new Blob([JSON.stringify(postData)], {
      type: "application/json"
    }));
    
  }

  loadImageFromDevice(event) {

    this.file = event.target.files[0];


    const reader = new FileReader();

    reader.readAsArrayBuffer(this.file);

    reader.onload = () => {

      // get the blob of the image:
      this.adInfo.imageBlob = new Blob([new Uint8Array((reader.result as ArrayBuffer))]);
      // create blobURL, such that we could use it in an image element:
      let blobURL: string = URL.createObjectURL(this.adInfo.imageBlob);


    };

    reader.onerror = (error) => {

      //handle errors

    };
  }


  //Get current coordinates of device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;
      alert('Error getting location' + JSON.stringify(this.accuracy));
      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
      this.adInfo.latitude = this.latitude.toString();
      this.adInfo.longitude = this.longitude.toString();

    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.adInfo.address = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }


  takePhoto() {
    // @ts-ignore
    const camera: any = navigator.camera;
    camera.getPicture(imageData => {
      this.myPhoto = this.convertFileSrc(imageData);
      this.changeDetectorRef.detectChanges();
      this.changeDetectorRef.markForCheck();
      this.uploadPhoto(imageData);
    }, error => this.error = JSON.stringify(error), {
      quality: 100,
      destinationType: camera.DestinationType.FILE_URI,
      sourceType: camera.PictureSourceType.CAMERA,
      encodingType: camera.EncodingType.JPEG
    });
  }

  selectPhoto(): void {
    // @ts-ignore
    const camera: any = navigator.camera;
    camera.getPicture(imageData => {
      this.myPhoto = this.convertFileSrc(imageData);
      this.uploadPhoto(imageData);
    }, error => this.error = JSON.stringify(error), {
      sourceType: camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: camera.EncodingType.JPEG,
    });
  }

  private convertFileSrc(url: string): string {
    if (!url) {
      return url;
    }
    if (url.startsWith('/')) {
      // @ts-ignore
      return window.WEBVIEW_SERVER_URL + '/_app_file_' + url;
    }
    if (url.startsWith('file://')) {
      // @ts-ignore
      return window.WEBVIEW_SERVER_URL + url.replace('file://', '/_app_file_');
    }
    if (url.startsWith('content://')) {
      // @ts-ignore
      return window.WEBVIEW_SERVER_URL + url.replace('content:/', '/_app_content_');
    }
    return url;
  }

  private async uploadPhoto(imageFileUri: any) {
    this.error = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });

    this.loading.present();

    // @ts-ignore
    window.resolveLocalFileSystemURL(imageFileUri,
      entry => {
        entry.file(file => this.readFile(file));
      });
  }

  private readFile(file: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: file.type});
      formData.append('file', imgBlob, file.name);
     // this.postData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

 

  private async showToast(ok: boolean | {}) {
    if (ok === true) {
      const toast = await this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

 

}





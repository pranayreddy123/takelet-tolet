import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NgForm } from '@angular/forms';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { NgStyle } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { LoadingController, ToastController } from '@ionic/angular';
import { Platform, ActionSheetController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
declare var google;
const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-postadd',
  templateUrl: './postadd.page.html',
  styleUrls: ['./postadd.page.scss'],
})

export class PostaddPage implements OnInit {
  // Readable Address
  address: string;
  adInfo: any;
  public myPhoto: any;
  public error: string;
  private loading: any;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  GoogleAutocomplete: any;
  geocoder: any;

  images = [];
  // Location coordinates
  latitude: number;
  longitude: number;
  accuracy: number;

  constructor(private http: HttpClient, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder, private readonly changeDetectorRef: ChangeDetectorRef, private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    public zone: NgZone, private plt: Platform, private actionSheetCtrl: ActionSheetController, private toastController: ToastController, private storage: Storage, private loadingController: LoadingController,
    private ref: ChangeDetectorRef, private filePath: FilePath, private camera: Camera, private webview: WebView, private file:File) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
  ngOnInit() {
    this.adInfo = { latitude: "", longitude: "", imageBlob: Blob };
    this.getGeolocation();
    this.plt.ready().then(() => {
      this.loadStoredImages();
    });
  }
 
  loadStoredImages() {
    this.storage.get(STORAGE_KEY).then(images => {
      if (images) {
        let arr = JSON.parse(images);
        this.images = [];
        for (let img of arr) {
          let filePath = this.file.dataDirectory + img;
          let resPath = this.pathForImage(filePath);
          this.images.push({ name: img, path: resPath, filePath: filePath });
        }
      }
    });
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
    //formData.append('file', this.file);
    formData.append('location', new Blob([JSON.stringify(postData)], {
      type: "application/json"
    }));

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

  async selectImageSource() {
    const buttons = [
      {
        text: 'camera',
        icon: 'camera',
        handler: () => {
          this.takeCamPhoto();
        }
      },
      {
        text: 'browse images',
        icon: 'image',
        handler: () => {
          this.browsePhoto();
        }
      }
    ];

    // Only allow file selection inside a browser
    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a File',
        icon: 'attach',
        handler: () => {
          // this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      buttons
    });
    await actionSheet.present();
  }






  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }


  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }


  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    alert(this.file.dataDirectory);
    alert(currentName);
    alert(namePath);
    alert(newFileName);
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      alert('Error while storing file.');
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    alert("updateStoredImages");
    alert(name);
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.images = [newEntry, ...this.images];
      alert(this.images);
      this.ref.detectChanges(); // trigger change detection cycle
    });
  }

  startUpload(imgEntry) {
    
}

  takeCamPhoto() {
    var options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(imageData => {
      var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
      var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    });
  }

  browsePhoto(): void {
    var options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imageData => {
      if (this.plt.is('android')) {
        this.filePath.resolveNativePath(imageData)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        alert("ios");
        var currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
        var correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });

  }









  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults() {
    alert('called')
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];

        this.zone.run(() => {
          predictions.forEach((prediction) => {

            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  //wE CALL THIS FROM EACH ITEM.
  SelectSearchResult(item) {
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
    this.geocoder.geocode({ 'address': item.description }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let latLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }




        // //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
        // this.getAddressFromCoords(results[0].geometry.location.lat,results[0].geometry.location.lng); 
        // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
        // this.map.addListener('tilesloaded', () => {
        //   console.log('accuracy',this.map, this.map.center.lat());
        //   this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        //   this.lat = this.map.center.lat()
        //   this.long = this.map.center.lng()
        // });
      }
    });
  }
  ClearAutocomplete() {
    this.autocompleteItems = []
    this.autocomplete.input = ''
  }





}





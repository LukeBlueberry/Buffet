import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {JsonPipe, NgForOf, NgIf, NgStyle} from "@angular/common";

import 'leaflet.offline';
import 'leaflet';
import * as L from 'leaflet';
import {getStorageInfo, savetiles, StoredTile, tileLayerOffline} from "leaflet.offline";
import {LocationService} from "../location.service";
import {latLng, Marker} from "leaflet";
import {MatTab, MatTabChangeEvent, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {MatIcon} from "@angular/material/icon";
import {delay, Observable, Subject} from "rxjs";
import {WebcamImage, WebcamInitError, WebcamModule, WebcamUtil} from "ngx-webcam";
import {FormsModule} from "@angular/forms";
import {db} from "../db";
import {RouterLink} from "@angular/router";


const circleOptions = {
  radius: 5,
  fillColor: 'white',
  color: '#0000FF',
  weight: 5,
  opacity: 1,
  fillOpacity: 0.8
}

@Component({
  selector: 'app-gps',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    JsonPipe,
    MatTabGroup,
    MatTab,
    MatIcon,
    MatTabLabel,
    NgStyle,
    WebcamModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './gps.component.html',
  styleUrl: './gps.component.css'
})


export class GpsComponent implements AfterViewInit, OnInit{


  private map : L.Map;
  private watchID : number | undefined;
  protected lat : number = 44.6509;
  protected lon : number = -63.5923;

  public isTracking = false;
  public locations: {latitude: number, longitude: number, accuracy: number}[] = [];
  public watchId : number | undefined;

  public storage: Promise<StoredTile[]>;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage | null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();
  public surveyInProgress: boolean = false;
  public surveyor: string;
  public mission: string;
  ripeCount: number = 0;
  notRipeCount: number = 0;

  constructor(private geolocationService: LocationService) {}

  //increments the ripe counter
  incrementRipe() {
    this.ripeCount++;
  }

  //increments the not ripe counter
  incrementNotRipe() {
    this.notRipeCount++;
  }

  //resets both counters, called on button press or after a save
  resetCounts() {
    this.ripeCount = 0;
    this.notRipeCount = 0;
  }

  isFormValid(): boolean {
    return this.surveyor.trim() !== '' && this.mission.trim() !== '';
  }

  // Function to handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      this.surveyInProgress = true;
    } else {
      console.log('Form is invalid');
    }
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }


  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean|string> {
    return this.nextWebcam.asObservable();
  }

  discardImage(){
    this.webcamImage = null;
  }
  submitImage(){
    if(this.webcamImage !== null) {
      this.savePicture(this.webcamImage.imageAsDataUrl)
    }
    this.discardImage();
  }
  ngOnInit(): void {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
        },
        (error) =>{
          console.log(error);
        },
        {
          timeout: 15000,
          maximumAge: 0
        })
    }
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }
  ngAfterViewInit(){

    this.initMap();

    const baseLayer = tileLayerOffline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abc',
      minZoom: 13,
    }).addTo(this.map);
    const savecontrol = savetiles(baseLayer, {
      zoomlevels: [16, 18], // optional zoomlevels to save, default current zoomlevel
      alwaysDownload: false,
      saveText: '<i class="fa fa-download" title="Save tiles"></i>',
      rmText: '<i class="fa fa-trash" title="Remove tiles"></i>',
    });
    savecontrol.addTo(this.map);
    const userLocation = L.circleMarker([this.lat, this.lon], circleOptions);
    userLocation.addTo(this.map);
    this.drawUserLocation(userLocation);
  }


  initMap() {
    this.map = L.map('map', {
      center: [ this.lat, this.lon ],
      zoom: 16
    }).locate({setView: true, maxZoom: 16});
  }

  drawUserLocation(userLocation : L.CircleMarker) {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        userLocation?.setLatLng([position.coords.latitude, position.coords.longitude]);
        if(this.surveyInProgress){
          this.lat = position.coords.latitude;
          this.lon = position.coords.longitude;
          this.saveRoute(this.lat, this.lon);
        }

      },
      error: (error) => {
        console.error('Error getting geolocation:', error);
      },
    });
  }

  async saveRoute(latitudeInput : number, longitudeInput : number) {
    console.log(db);
    await db.route.add({
      mission: this.mission,
      latitude: latitudeInput,
      longitude: longitudeInput,
    });
  }

  async saveSurvey() {
    console.log(db);
    await db.survey.add({
      surveyor: this.surveyor,
      ripeCount: this.ripeCount,
      notRipeCount: this.notRipeCount,
      surveyTime: new Date(),
      latitude: this.lat,
      longitude: this.lon,
      mission: this.mission
    });
    this.resetCounts();
  }

  async savePicture(image : string): Promise<void> {
    console.log(db);
    await db.photo.add({
      latitude: this.lat,
      longitude: this.lon,
      mission: this.mission,
      photo: image,
    });
  }

  completeSurvey(){
    this.surveyInProgress = false;
  }



  // toggleTracking(){
  //   if (this.isTracking) {
  //     if (typeof this.watchId === "number") {
  //       navigator.geolocation.clearWatch(this.watchId);
  //     }
  //     this.watchId = undefined;
  //   }
  //   else{
  //     let watchId = navigator.geolocation.watchPosition(
  //       (position) => {
  //         this.locations.push({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy });
  //       },
  //       (err) =>{
  //         console.log(err);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 5000,
  //         maximumAge: 10000
  //       }
  //     )
  //   }
  //   this.isTracking = !this.isTracking;
  //
  // }
  //
  // storageInfo(){
  //   this.storage = getStorageInfo('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  //   console.log(this.storage)
  // }

}

import { Component } from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {db} from "../db";
import * as L from "leaflet";
import {savetiles, tileLayerOffline} from "leaflet.offline";

const surveyOptions = {
  color: 'green',
  radius: 5,
  fillColor: 'white',
  weight: 5,
  opacity: 1,
  fillOpacity: 0.8
}

const pictureOptions = {
  color: 'yellow',
  radius: 5,
  fillColor: 'white',
  weight: 5,
  opacity: 1,
  fillOpacity: 0.8
}

@Component({
  selector: 'app-report',
  standalone: true,
    imports: [
        MatIcon,
        RouterLink
    ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {

  private map : L.Map;
  private watchID : number | undefined;
  protected lat : number = 44.6509;
  protected lon : number = -63.5923;

  async ngOnInit(): Promise<void> {

    this.map = L.map('map', {
      center: [ this.lat, this.lon ],
      zoom: 16
    }).locate({setView: true, maxZoom: 16});
    const baseLayer = tileLayerOffline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abc',
      minZoom: 13,
    }).addTo(this.map);

    const route = await db.getRoute();
    var latlngs: {lat: number, lng: number}[] = [];
    for(let pt of route){
      latlngs.push({lat: pt.latitude, lng: pt.longitude});
    }
    var path = L.polyline(
      latlngs,
      {"dashArray":[10,20],"weight":3,"color":"red"}
    ).addTo(this.map);
    this.map.addLayer(path);
    const survey = await db.getSurveys();
    for(let p of survey){
      L.circleMarker([p.latitude, p.longitude], surveyOptions).addTo(this.map).bindPopup("<p>Mission: " + p.mission + " Ripecount: " + p.ripeCount + " Not Ripe Count: " + p.notRipeCount + "</p>");
    }
    const photos = await db.getPhoto();
    for(let p of photos){
      L.circleMarker([p.latitude, p.longitude], pictureOptions).addTo(this.map).bindPopup("<img src='" + p.photo + "' width = 100px height = 100px>");

    }
  }

}

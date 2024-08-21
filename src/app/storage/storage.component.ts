import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgForOf} from "@angular/common";
import {liveQuery} from "dexie";
import {db} from "../db";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-storage',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    AsyncPipe,
    MatIcon,
    RouterLink
  ],
  templateUrl: './storage.component.html',
  styleUrl: './storage.component.css'
})
export class StorageComponent implements OnInit{

  counts:  {
  id?:number;
  mission: string;
  latitude: number;
  longitude: number;
}[] = [];
  usage : number | undefined;
  available : number | undefined;
  async ngOnInit(): Promise<void> {
    this.counts = await db.getRoute();
    navigator.storage.estimate().then(value => {
      this.usage = value.usage;
      this.available = value.quota;
    })
  }

  async displayImages() {
    const images = await db.getPhoto();
    images.forEach(img => {
      const imgElement = document.createElement('img');
      imgElement.src = img.photo;
      document.body.appendChild(imgElement);
    });
  }


  protected readonly navigator = navigator;
}

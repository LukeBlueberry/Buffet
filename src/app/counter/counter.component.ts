import { Component } from '@angular/core';
import {db} from "../db";
import {liveQuery} from "dexie";
import {RouterLink} from "@angular/router";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.css'
})
export class CounterComponent {
  ripeCount: number = 0;
  notRipeCount: number = 0;

  survey$ = liveQuery(() => db.survey.toArray());

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

  //saves current counts to indexdb and resets
  async saveCounts() {
    console.log(db);
    await db.survey.add({
      surveyor: "Luke Laing",
      ripeCount: this.ripeCount,
      notRipeCount: this.notRipeCount,
      surveyTime: new Date(),
      latitude: 11,
      longitude: 11,
      mission: 'test'
    });
    this.resetCounts();
  }
}

import { Component, OnInit } from '@angular/core';
import {db} from "../db";
import {RouterLink} from "@angular/router";
import {DatePipe, NgForOf} from "@angular/common";


@Component({
  selector: 'app-savedsurveys',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    DatePipe
  ],
  templateUrl: './savedsurveys.component.html',
  styleUrl: './savedsurveys.component.css'
})
export class SavedsurveysComponent {

  //counts array used to store results of getSurveys
  counts: {id?:number;
    surveyor: string;
    ripeCount: number;
    notRipeCount: number;
    surveyTime: Date;}[] = [];

  //function call to update the counts array, probably a much better way to do this, maybe emitters
  async ngDoCheck(){
    this.counts = await db.getSurveys();
  }

  //calls the db.ts function to remove cached surveys
  clearCache(){
    db.clearCache();
  }
}

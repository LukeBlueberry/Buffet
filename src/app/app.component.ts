import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CounterComponent} from "./counter/counter.component";
import {liveQuery} from "dexie";
import {db, ISurvey} from "./db";
import {SavedsurveysComponent} from "./savedsurveys/savedsurveys.component";
import {GcdsComponentsModule} from "@cdssnc/gcds-components-angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CounterComponent, SavedsurveysComponent, GcdsComponentsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  title = 'blueberry-banquet';



}

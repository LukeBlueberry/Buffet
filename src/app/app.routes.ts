import {RouterModule, Routes} from '@angular/router';
import {CounterComponent} from "./counter/counter.component";
import {SavedsurveysComponent} from "./savedsurveys/savedsurveys.component";
import {LandingpageComponent} from "./landingpage/landingpage.component";
import {NgModule} from "@angular/core";
import {GpsComponent} from "./gps/gps.component";
import {StorageComponent} from "./storage/storage.component";
import {ReportComponent} from "./report/report.component";

export const routes: Routes = [
  {path:'', component: LandingpageComponent, title: 'Landing page'},
  {path:'count', component: CounterComponent, title: 'Counter Component'},
  {path:'listsurveys', component: SavedsurveysComponent, title: 'Saved surveys'},
  {path:'gps', component: GpsComponent, title: 'GPS Tracker'},
  {path:'storage', component: StorageComponent, title: 'Storage Analysis'},
  {path:'report', component: ReportComponent, title: 'Survey Report'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

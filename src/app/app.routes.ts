import {RouterModule, Routes} from '@angular/router';
import {CounterComponent} from "./counter/counter.component";
import {SavedsurveysComponent} from "./savedsurveys/savedsurveys.component";
import {NgModule} from "@angular/core";

export const routes: Routes = [
  {path:'count', component: CounterComponent},
  {path:'listsurveys', component: SavedsurveysComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

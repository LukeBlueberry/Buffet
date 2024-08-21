import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-landingpage',
  standalone: true,
    imports: [
        RouterLink,
        MatIcon
    ],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.css'
})
export class LandingpageComponent {

}

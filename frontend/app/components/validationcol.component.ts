import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../services/data.service';

@Component({
  selector: "validation-col",
  templateUrl: "validationcol.component.html"
})
export class ValidationColComponent implements OnInit {

  constructor(private dataService: DataService) {}

}

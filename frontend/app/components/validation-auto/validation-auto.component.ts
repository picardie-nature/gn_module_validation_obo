import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-auto",
  templateUrl: "validation-auto.component.html"
})
export class ValidationAuto implements OnInit {

  @Input() cd_nom: number;
  
  constructor(private dataService: DataService) {}

 
}

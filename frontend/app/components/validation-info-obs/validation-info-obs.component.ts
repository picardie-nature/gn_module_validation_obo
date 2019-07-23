import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-info-obs",
  templateUrl: "validation-info-obs.component.html"
})
export class ValidationInfoObsComponent implements OnInit {

  @Input() cd_nom: number;
  properties: any[];

  constructor(private dataService: DataService) {}

  ngOnInit() {

     this.dataService.getOneSyntheseObservation(this.cd_nom).subscribe(
        data => {
            this.properties=data['properties'];
        }

    )


  }
}

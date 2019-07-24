import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-info-obs",
  templateUrl: "validation-info-obs.component.html"
})
export class ValidationInfoObsComponent implements OnInit {

  @Input() cd_nom: number;
  properties: any[];
  data:any[];

  constructor(private dataService: DataService) {}

  ngOnChanges() {

     this.dataService.getOneSyntheseObservation(this.cd_nom).subscribe(
        data => {
            this.properties=data['properties'];
            this.data=data;
            this.latLng=[data.geometry.coordinates[1],data.geometry.coordinates[0]]; //ajouter un trick pour gerer les lignes, polygones, multipoint, etc.. --> Turfjs ?
            this.geoJson={type:'FeatureCollection', features:[data]};
          
        }

    )


  }
}

import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-info-obs",
  templateUrl: "validation-info-obs.component.html",
  styleUrls: ["validation-info-obs.component.scss"]
})
export class ValidationInfoObsComponent implements OnInit {

  @Input() cd_nom: number;
  properties: any[];
  data:any[];

  constructor(private dataService: DataService) {}

  ngOnChanges() {
    this.data=null;
    this.properties=null;
    this.obsTaxon=null;
    this.dataService.getOneSyntheseObservation(this.cd_nom).subscribe(
        data => {
            this.properties=data['properties'];
            this.data=data;
            this.latLng=[data.geometry.coordinates[1],data.geometry.coordinates[0]]; //ajouter un trick pour gerer les lignes, polygones, multipoint, etc.. --> Turfjs ?
            this.geoJson={type:'FeatureCollection', features:[data]};
               this.dataService.getTaxref(this.properties.cd_nom).subscribe(
                dataTaxref => {
                    this.obsTaxon=dataTaxref;
                }
           )
          
        }
    )

  }
  onVote(e){
    console.log(e);
    console.log('onVote depuis info-obs');
    this.data=null;
    this.properties=null;
    this.ngOnChanges();
  }
}

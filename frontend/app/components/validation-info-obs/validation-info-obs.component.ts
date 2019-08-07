import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import * as turf from "turf";
import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-info-obs",
  templateUrl: "validation-info-obs.component.html",
  styleUrls: ["validation-info-obs.component.scss"]
})
export class ValidationInfoObsComponent implements OnInit {

  @Input() lst_taxons: any[];
  properties: any[];
  data:any[];

  constructor(
        private dataService: DataService,

) {}

  ngOnChanges() {
    this.data=null;
    this.error_type=null;
    this.properties=null;
    this.obsTaxon=null;
    this.lst_cd_noms=[];
    for (let e of this.lst_taxons) { this.lst_cd_noms.push(e.cd_nom) };
    this.dataService.getOneSyntheseObservation(this.lst_cd_noms).subscribe(
        data => {
            this.properties=data['properties'];
            this.data=data;
            this.centroid = turf.centroid(data.geometry);
            this.latLng=[ this.centroid.geometry.coordinates[1] , this.centroid.geometry.coordinates[0] ];
            this.geoJson={type:'FeatureCollection', features:[data]};
               this.dataService.getTaxref(this.properties.cd_nom).subscribe(
                dataTaxref => {
                    this.obsTaxon = dataTaxref;
                }
           )   
        },
        error => {
            console.log(error);
            this.error_type = error.error.error_type;
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

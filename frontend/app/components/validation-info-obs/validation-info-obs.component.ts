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
  data_cache:any[];
  data_cache = [];
  constructor(
        private dataService: DataService,

  ) {}

  ngOnChanges() {
    console.log("onchange");
    this.data=null;
    this.error_type=null;
    this.properties=null;
    this.obsTaxon=null;
    this.lst_cd_noms=[];
    for (let e of this.lst_taxons) { this.lst_cd_noms.push(e.cd_nom) };

    if(this.data_cache.length > 0)
    { 
        this.display_data(this.data_cache[0]); 
        console.log('a'); 
    }else{
    //load and display data
        this.dataService.getOneSyntheseObservation(this.lst_cd_noms).subscribe( 
            data => {
                this.data_cache.push(data);
                if(this.data == null){
                    this.display_data(this.data_cache[0]); 
                    console.log('b'); 
                }
                console.log(this.data_cache);
            }
        )
    }
  }

  onVote(e){
    this.data_cache.shift();
    console.log(e);
    console.log('onVote depuis info-obs');
    console.log(this.data_cache);
    this.data=null;
    this.properties=null;
    this.ngOnChanges();
  }

  display_data(data){
            this.properties=data['properties'];
            this.data=data;
            this.centroid = turf.centroid(data.geometry);
            this.latLng=[ this.centroid.geometry.coordinates[1] , this.centroid.geometry.coordinates[0] ];
            this.geoJson={type:'FeatureCollection', features:[data]};
            this.dataService.getTaxref(this.properties.cd_nom).subscribe(
                dataTaxref => {
                    this.obsTaxon = dataTaxref;
                }
           );
            this.dataService.getOneSyntheseObservation(this.lst_cd_noms).subscribe( //préchargement du suivant
                data => {
                console.log('apush');
                this.data_cache.push(data);
                console.log(this.data_cache);
            }
    )
    
    };
}

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
  load_flag = false;
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
    
    this.display_data(); 
    this.load_data(); //preload next


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

    load_data(display=false){ //add data to data_cache
        this.dataService.getOneSyntheseObservation(this.lst_cd_noms).subscribe(
            data => {
                this.data_cache.push(data);
                if(display) { this.display_data() }
            }
        )
    }

    display_data(){ 
            if (this.data_cache.length > 0) { //data dispo
                this.properties=this.data_cache[0]['properties'];
                this.data=this.data_cache[0];
                this.centroid = turf.centroid(this.data_cache[0].geometry);
                this.latLng=[ this.centroid.geometry.coordinates[1] , this.centroid.geometry.coordinates[0] ];
                this.geoJson={type:'FeatureCollection', features:[this.data_cache[0]]};
                this.dataService.getTaxref(this.properties.cd_nom).subscribe(
                    dataTaxref => {
                        this.obsTaxon = dataTaxref;
                    }
               );
            }else{
                console.log('abc');
                this.load_data(true);
            }
    }
}

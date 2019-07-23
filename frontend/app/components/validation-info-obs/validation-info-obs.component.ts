import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-info-obs",
  templateUrl: "validation-info-obs.component.html"
})
export class ValidationInfoObsComponent implements OnInit {

  @Input() cd_nom: number;
  @Input() currentTaxon: number;
  @Input() stop: number;
  @Output() taxsup = new EventEmitter<string>();
  taxinf : any;

  constructor(private dataService: DataService) {}

  openTaxSup(){
        //console.log(this.parentId)
        this.taxsup.emit(this.parentId);
    }

  openTaxInf(){
        console.log(this.taxInf)

  }

  getBgcolor(){
     if(this.currentTaxon == this.cd_nom){ return '#FF0000' }
    else { return '#000000' }
  }

  ngOnInit() {

     this.dataService.getOneSyntheseObservation(this.cd_nom).subscribe(
        data => {
            this.properties=data['properties'];
        }

    )


  }
}

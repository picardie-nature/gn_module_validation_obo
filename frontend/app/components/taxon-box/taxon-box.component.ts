import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { TaxrefService } from '../../services/taxref.service';

@Component({
  selector: "taxon-box",
  templateUrl: "taxon-box.component.html"
})
export class TaxonBoxComponent implements OnInit {

  @Input() cd_nom: number;
  @Input() currentTaxon: number;
  @Input() stop: number;
  @Output() taxsup = new EventEmitter<string>();
  taxinf : any;

  constructor(private taxrefService: TaxrefService) {}

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

     this.taxrefService.getTaxon(this.cd_nom).subscribe(
        data => {
            this.nom_s=data['name'];
            this.parentId=data['saisie_sup'];
        }

      this.taxrefService.getTaxonChildren(this.cd_nom).subscribe(
            data => {
                this.taxInf=data;

            }
        )
    )


  }
}

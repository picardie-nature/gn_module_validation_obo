import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-stats-taxon",
  templateUrl: "validation-stats-taxon.component.html",
  styleUrls: ["validation-stats-taxon.component.scss"]
})
export class ValidationStatsTaxon implements OnInit {
    stats:any;
    @Input() lb_nom: string;
    @Input() lst_taxons: any[];
    constructor(private dataService: DataService) {}
    
    ngOnChanges(){
        this.lst_cd_noms=[];
        this.stats=null;
        for (let e of this.lst_taxons) { this.lst_cd_noms.push(e.cd_nom) };
        this.dataService.getStatsTaxon(this.lst_cd_noms).subscribe(
            data => {
                this.stats=data;
                this.stats.total=this.stats.en_cours + this.stats.evalue + this.stats.non_evalue;
            }
        )
    }


}

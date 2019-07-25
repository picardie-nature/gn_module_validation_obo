import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-stats-taxon",
  templateUrl: "validation-stats-taxon.component.html",
  styleUrls: ["validation-stats-taxon.component.scss"]
})
export class ValidationStatsTaxon implements OnInit {
    stats:any;
    @Input() cd_nom: number;
    @Input() lb_nom: string;
    constructor(private dataService: DataService) {}
    
    ngOnChanges(){
        this.dataService.getStatsTaxon(this.cd_nom).subscribe(
            data => {
                this.stats=data;
                this.stats.total=this.stats.en_cours + this.stats.evalue + this.stats.non_evalue;
            }
        )
    }


}

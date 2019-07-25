import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-stats-taxon",
  templateUrl: "validation-stats-taxon.component.html",
  styleUrls: ["validation-stats-taxon.component.scss"]
})
export class ValidationStatsTaxon implements OnInit {

    //@Input() selectedTaxon: number;
    constructor(private dataService: DataService) {}
    



}

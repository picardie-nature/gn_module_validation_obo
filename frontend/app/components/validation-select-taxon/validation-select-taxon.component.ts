import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { FormService } from '../../services/form.service';

@Component({
  selector: "validation-select-taxon",
  templateUrl: "validation-select-taxon.component.html"
})
export class ValidationSelectTaxon implements OnInit {

    @Output() selectedTaxon = new EventEmitter<string>();
    constructor(private formService: FormService) {}
    
    onSelectedTaxon(a){
        //console.log(a)
        this.selectedTaxon.emit(a.item);
    }


}

import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { FormService } from '../../services/form.service';

@Component({
  selector: "validation-select-taxon",
  templateUrl: "validation-select-taxon.component.html"
})
export class ValidationSelectTaxon implements OnInit {

    @Output() selectedTaxon = new EventEmitter<string>();
    listSelectedTaxons = [];
    constructor(private formService: FormService) {}
        

    onSelectedTaxon(a){
        console.log(a);
        this.listSelectedTaxons.push(a.item);
        console.log(this.listSelectedTaxons);
    }

    onSubmitForm(){
        console.log('click submit');
        console.log(this.listSelectedTaxons);
        this.selectedTaxon.emit(this.listSelectedTaxons);
    }

    removeTaxon(i){
        console.log(this.listSelectedTaxons[i]);
        this.listSelectedTaxons.splice(i,1);
    }

}

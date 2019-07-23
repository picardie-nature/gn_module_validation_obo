import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";

import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-toolbar",
  templateUrl: "validation-toolbar.component.html"
})
export class ValidationToolbar implements OnInit {

    constructor(private dataservice: DataService) {}

    onVote(value){
        console.log('clic vote button :'+value);
        this.dataservice.postVote(780972,value).subscribe(
            data => {
                console.log(data);
            }
        );
    }

}

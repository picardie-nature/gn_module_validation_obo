import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';

import { DataService } from '../services/data.service';

@Component({
  selector: "validation-col",
  templateUrl: "validationcol.component.html"
})
export class ValidationColComponent implements OnInit {
  constructor(private dataService: DataService) {}
    var_test:string='abcd';
    var_test2:string='qwerty';

    
  /*ngOnInit() {
        this.taxrefService.getTaxonChildren(0).subscribe(
            data => {
                this.taxonsArray=data;

            }
        )

    }*/
}

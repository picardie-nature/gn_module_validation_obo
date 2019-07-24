import { Component, OnInit } from "@angular/core";
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../services/data.service';

@Component({
  selector: "validation-col-view",
  templateUrl: "validationcol-view.component.html"
})
export class ValidationColViewComponent implements OnInit {
  taxon = null;
  constructor(
     private dataService: DataService,
     private toastr: ToastrService
  ) {}
  loadTaxon(a){ 
    this.taxon = null;
    console.log('chargement de ');
    console.log(a.cd_nom);
    this.taxon = a;
    this.toastr.info('Debut de la validation pour '+a.cd_nom);
  }
}

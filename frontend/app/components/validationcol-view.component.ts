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

  loadTaxon(a){ //charge une liste de taxon
    this.lst_taxons = a.slice(0);
    console.log('chargement de ');
    console.log(a);
    this.toastr.info('Début de la validation');
  }
}

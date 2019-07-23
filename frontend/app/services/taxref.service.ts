import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { AppConfig } from "@geonature_config/app.config";

@Injectable()
export class TaxrefService {
  
    //test_subject=new Subject<string>();

    truc: string='abcd';
    nom_s: string='indef.';


  constructor(private httpClient: HttpClient) { }

  getTaxon(id_taxon){
    return this.httpClient.get<any>(`${AppConfig.API_ENDPOINT}/ecole/taxon/${id_taxon}`);

  }

  getTaxonChildren(id_taxon){
    return this.httpClient.get<any>(`${AppConfig.API_ENDPOINT}/ecole/taxon/${id_taxon}/children`);

  }


}

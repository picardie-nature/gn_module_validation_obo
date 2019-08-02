import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpEventType,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { GeoJSON } from 'leaflet';
import { AppConfig } from '@geonature_config/app.config';
import { isArray } from 'util';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CommonService } from '@geonature_common/service/common.service';
import { Observable } from 'rxjs';


@Injectable()
export class DataService {
    constructor(private _api: HttpClient) { }

    getOneSyntheseObservation(lst_cd_noms) {
        return this._api.get<GeoJSON>(`${AppConfig.API_ENDPOINT}/validation_col/next/?cd_noms=${lst_cd_noms}`);
    }

    getTaxref(cd_nom) {
        return this._api.get<GeoJSON>(`${AppConfig.API_TAXHUB}/taxref/${cd_nom}`);
    }

    getStatsTaxon(lst_cd_noms){
        return this._api.get<GeoJSON>(`${AppConfig.API_ENDPOINT}/validation_col/stats/?cd_noms=${lst_cd_noms}`);
    }

    postVote(id_synthese, statut,comment = null){
        return this._api.post<any>(
            `${AppConfig.API_ENDPOINT}/validation_col/${id_synthese}`, {comment:comment,statut:statut }
        );
    }
}

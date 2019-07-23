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

    getOneSyntheseObservation(cd_nom) {
        return this._api.get<GeoJSON>(`${AppConfig.API_ENDPOINT}/validation_col/taxon/${cd_nom}/next`);
    }

    postVote(id_synthese, statut){
        return this._api.post<any>(
            `${AppConfig.API_ENDPOINT}/validation_col/${id_synthese}`, {comment:'test',statut:statut }
        );
    }
}

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
import { FormGroup, FormBuilder, FormControl, ValidatorFn } from '@angular/forms';

@Injectable()
export class FormService {
    formCdNom: FormGroup;
    constructor(
        private _fb: FormBuilder,    
    )
    {
        this.selectTaxonForm = _fb.group({cd_nom:null});
    }


}

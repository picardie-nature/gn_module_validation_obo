import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GN2CommonModule } from "@geonature_common/GN2Common.module";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { ValidationColComponent } from "./components/validationcol.component";
import { ValidationColViewComponent } from "./components/validationcol-view.component";
import { ValidationInfoObsComponent } from './components/validation-info-obs/validation-info-obs.component';
import { ValidationToolbar } from './components/validation-toolbar/validation-toolbar.component';
import { ValidationSelectTaxon } from './components/validation-select-taxon/validation-select-taxon.component';

import { DataService } from './services/data.service';
import { FormService } from './services/form.service';

// my module routing
const routes: Routes = [{ path: "", component: ValidationColComponent }];

@NgModule({
  declarations: [
        ValidationColComponent,ValidationColViewComponent,ValidationInfoObsComponent, ValidationToolbar, ValidationSelectTaxon
    ],
  imports: [CommonModule, GN2CommonModule, RouterModule.forChild(routes),HttpClientModule],
  providers: [DataService,FormService],
  bootstrap: []
})
export class GeonatureModule {}

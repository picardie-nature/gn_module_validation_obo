import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GN2CommonModule } from "@geonature_common/GN2Common.module";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { ValidationColComponent } from "./components/validationcol.component";
import { ValidationInfoObsComponent } from './components/validation-info-obs/validation-info-obs.component';

import { DataService } from './services/data.service';

// my module routing
const routes: Routes = [{ path: "", component: ValidationColComponent }];

@NgModule({
  declarations: [
        ValidationColComponent,ValidationInfoObsComponent
    ],
  imports: [CommonModule, GN2CommonModule, RouterModule.forChild(routes),HttpClientModule],
  providers: [DataService],
  bootstrap: []
})
export class GeonatureModule {}

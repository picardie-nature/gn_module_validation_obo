import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-toolbar",
  templateUrl: "validation-toolbar.component.html"
})
export class ValidationToolbar implements OnInit {

    @Input() id_synthese: number;
    @Output() id_statut_voted = new EventEmitter<string>();

    constructor(
        private dataService: DataService,
        private toastr: ToastrService
    ) { };

    ngOnChanges(){
    };

    onVote(value){

        this.dataService.postVote(this.id_synthese,value).subscribe(
            data => {
                this.toastr.success('Vote enregistré');
                this.id_statut_voted.emit(value);
            },
            err => {
                this.toastr.warning('Il y a eu une erreur');
                this.id_statut_voted.emit(value);
            }
        );
    }

}

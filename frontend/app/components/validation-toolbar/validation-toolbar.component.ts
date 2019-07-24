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
        private dataservice: DataService,
        private toastr: ToastrService
    ) {}

    onVote(value){
        this.id_statut_voted.emit(value);
        console.log('clic vote button :'+value);
        this.dataservice.postVote(this.id_synthese,value).subscribe(
            data => {
                console.log(data);
                this.toastr.success('Vote enregistré');
            },
            err => {
                this.toastr.warning('Il y a eu une erreur');
            }
        );
    }

}

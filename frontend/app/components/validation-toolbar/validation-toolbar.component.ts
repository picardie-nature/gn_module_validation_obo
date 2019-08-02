import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { FormGroup,FormControl } from "@angular/forms";

@Component({
  selector: "validation-toolbar",
  templateUrl: "validation-toolbar.component.html"
})
export class ValidationToolbar implements OnInit {

    @Input() id_synthese: number;
    @Output() id_statut_voted = new EventEmitter<string>();
    commentFormControl = new FormControl;
    constructor(
        private dataService: DataService,
        private toastr: ToastrService
    ) { };

    ngOnChanges(){
    };

    onVote(value_status){
        this.dataService.postVote( this.id_synthese , value_status , this.commentFormControl.value ).subscribe(
            data => {
                this.toastr.success('Vote enregistré');
                this.id_statut_voted.emit(value_status);
                this.commentFormControl.setValue(null);
            },
            err => {
                this.toastr.warning('Il y a eu une erreur');
                this.id_statut_voted.emit(value_status);
                this.commentFormControl.setValue(null);
            }
        );
    }

}

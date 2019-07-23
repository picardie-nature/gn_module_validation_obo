import { Component, Input, Output, OnInit,EventEmitter } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';

@Component({
  selector: "validation-toolbar",
  templateUrl: "validation-toolbar.component.html"
})
export class ValidationToolbar implements OnInit {

    //ajouter l'id_synthese en input
    constructor(
        private dataservice: DataService,
        private toastr: ToastrService
    ) {}

    onVote(value){
        console.log('clic vote button :'+value);
        this.dataservice.postVote(780972,value).subscribe(
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

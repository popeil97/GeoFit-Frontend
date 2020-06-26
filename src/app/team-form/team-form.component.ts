import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  teamForm:FormGroup;
  uploadedUrl:any;
  raceName:string;
  raceID:number;

  constructor(private _teamService:TeamService,private route: ActivatedRoute,private router:Router) { 
    this.teamForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      teamImg: new FormControl(''),
      description: new FormControl('',[
        Validators.required
      ])
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });
  }

    createTeam(): void {
      let formClean:TeamForm;

      if(this.teamForm.valid) {
        formClean = this.teamForm.value;
        formClean.teamImg = this.uploadedUrl;

        this._teamService.createTeam(formClean,this.raceID).then((resp:TeamFormResp) => {
          console.log('TEAM FORM RESP:',resp);
          this.router.navigate(['/race',{id:this.raceID,name:this.raceName}]);
        });
      }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadedUrl = reader.result;
      }
    }
  }

}

export interface TeamForm {
  name:string,
  description:string,
  teamImg:any,
}

interface TeamFormResp {
  success:Boolean;
}
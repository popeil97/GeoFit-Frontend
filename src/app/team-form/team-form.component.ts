import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements OnInit {

  @Output() callback:EventEmitter<any> = new EventEmitter();

  teamForm:FormGroup;
  uploadedUrl:any;
  raceName:string;
  raceID:number;
  followerOptions:any[];
  followersInvited:any[] = [];
  errorMsg:string;
  showError:Boolean = false;

  constructor(private _teamService:TeamService,private _userService:UsersService,private route: ActivatedRoute,private router:Router) { 
    this.teamForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      teamImg: new FormControl(''),
      description: new FormControl('',[
        Validators.required
      ]),
      invited: new FormControl('')
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    this._userService.getFollowersAndFollowed().then((resp:FollowersResp) => {
      console.log('RESP:',resp);
      this.followerOptions = resp.follwers_and_followed;
    });
  }

    createTeam(): void {
      let formClean:TeamForm;

      if(this.teamForm.valid) {
        this.showError = false;
        formClean = this.teamForm.value;
        formClean.teamImg = this.uploadedUrl;
        formClean.invited = this.followersInvited.map((follower) => follower.user_id);

        this._teamService.createTeam(formClean,this.raceID).then((resp:TeamFormResp) => {
          console.log('TEAM FORM RESP:',resp);
          // this.router.navigate(['/race',{id:this.raceID,name:this.raceName}]);

          if(!resp.success) {
            // display error message
            this.showError = true;
            this.errorMsg = resp.message;
          }

          this.callback.emit();
        });
      }
  }

  addFollower(option:any) {

    if(this.followersInvited.some(follower => follower.user_id == option.user_id)) {
      return;
    }

    console.log('option:',option);
    this.followersInvited.push(option);

    console.log(this.teamForm.value);
    this.teamForm.controls['invited'].setValue('');
    console.log(this.teamForm.value);
  }

  removeFollower(id:number) {
    this.followersInvited = this.followersInvited.filter((follower) => {
      return follower.user_id != id;
    });
    console.log(this.followersInvited);
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
  invited:any[]
}

interface TeamFormResp {
  success:Boolean;
  message:string;
}

interface FollowersResp {
  follwers_and_followed:any[];
}
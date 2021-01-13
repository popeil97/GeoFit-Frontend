import { Component, OnInit, EventEmitter, Output, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TeamService } from '../team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users.service';
import { TeamEditBody } from '../race-view-page/race-view-page.component';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.css']
})
export class TeamFormComponent implements AfterViewInit,OnChanges {
  @Input() teamEditForm:TeamEditBody;
  @Input() raceID:number;
  @Output() callback:EventEmitter<any> = new EventEmitter();

  teamForm:FormGroup;
  uploadedUrl:any;
  raceName:string;
  followerOptions:any[];
  followersInvited:any[] = [];
  errorMsg:string;
  showError:Boolean = false;

  constructor(private _teamService:TeamService,
              private _userService:UsersService,
              private route: ActivatedRoute,
              private router:Router) {
                
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
  ngAfterViewInit(): void {
    return;
  }
  ngOnChanges(changes: SimpleChanges): void {
   //  console.log('changes:',changes);

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'teamEditForm':
          //   console.log('IS_EDIT CHANGED');
            if(changes.teamEditForm.currentValue != undefined) {
              
              if(this.teamEditForm.isEdit) {
                // make API call to get team info and intitialize form
                this.initForm();
              }

              // else do nothing
              else {
                this.teamForm.reset();
              }

            }
        }
      }
    }

  }

  ngOnInit() {
    // this.route.paramMap.subscribe(params => {
    //   this.raceName = params['params']['name'];
    //   this.raceID = params['params']['id'];
    // });

    this._userService.getFollowersAndFollowed().then((resp:FollowersResp) => {
     //  console.log('RESP:',resp);
      this.followerOptions = resp.follwers_and_followed;
    });
  }

  initForm(): void {

    let teamState:any = null;

    this._teamService.getTeam(this.teamEditForm.team_id).then((resp:any) => {
      teamState = resp.team;

    //   console.log('TEAM STATE:',teamState);

      this.teamForm = new FormGroup({
        name: new FormControl(teamState.name,[
          Validators.required,
          Validators.maxLength(30)
        ]),
        teamImg: new FormControl(''),
        description: new FormControl(teamState.description,[
          Validators.required
        ]),
        invited: new FormControl('')
      });
    });

    
  }

  createTeam(): void {
    let formClean:TeamForm;

      if(this.teamForm.valid) {
        this.showError = false;
        formClean = this.teamForm.value;
        formClean.teamImg = this.uploadedUrl;
        formClean.invited = this.followersInvited.map((follower) => follower.user_id);

        this._teamService.createTeam(formClean,this.raceID,false,null).then((resp:TeamFormResp) => {
        //   console.log('TEAM FORM RESP:',resp);
          // this.router.navigate(['/race',{id:this.raceID,name:this.raceName}]);

          if(!resp.success) {
            // display error message
            this.showError = true;
            this.errorMsg = resp.message;
            return;
          }
          console.log('GONNA CALL CALLBACK');
          this.callback.emit();
        });
      }
  }

  updateTeam() {
    let team_id = this.teamEditForm.team_id;

    let formClean:TeamForm;

    if(this.teamForm.valid) {
      this.showError = false;
      formClean = this.teamForm.value;
      formClean.teamImg = this.uploadedUrl;
      formClean.invited = this.followersInvited.map((follower) => follower.user_id);

      this._teamService.createTeam(formClean,this.raceID,true,team_id).then((resp:TeamFormResp) => {
      //   console.log('TEAM FORM RESP:',resp);
        // this.router.navigate(['/race',{id:this.raceID,name:this.raceName}]);

        if(!resp.success) {
          // display error message
          this.showError = true;
          this.errorMsg = resp.message;
          return;
        }

        this.callback.emit();
      });
    }

  }

  addFollower(option:any) {

    if(this.followersInvited.some(follower => follower.user_id == option.user_id)) {
      return;
    }

  //   console.log('option:',option);
    this.followersInvited.push(option);

 //    console.log(this.teamForm.value);
    this.teamForm.controls['invited'].setValue('');
 //    console.log(this.teamForm.value);
  }

  removeFollower(id:number) {
    this.followersInvited = this.followersInvited.filter((follower) => {
      return follower.user_id != id;
    });
  //   console.log(this.followersInvited);
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

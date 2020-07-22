import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../users/users.service';
declare var $: any
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-race-about',
  templateUrl: './race-about.component.html',
  styleUrls: ['./race-about.component.css']
})
export class RaceAboutComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  public AboutForm: FormGroup;
  aboutData:AboutData = {owner:{}} as AboutData;
  raceSettings:RaceSettings = {} as RaceSettings;
  showForm: Boolean;
  raceName:string;
  raceID:number;
  uploadeUrl:any;
  teamSizeOptions = [2,3,4,5,6,7,8,9,10];
  isOwner: Boolean;
  hasJoined: Boolean;
  public coords:any;
  public all_user_data:Array<FeedObj>;
  public followedIDs:number[];

  public num_users:any;

  constructor(private raceService:RaceService, private route:ActivatedRoute, private router:Router, private _userService: UserService,) { }

  ngOnInit() {

    this.showForm = false;

    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
    });

    this.raceService.getRace(this.raceID).subscribe(data => {

      let raceData = data as RaceData;
      console.log('RACE DATA:',raceData);
      this.coords = {coords:raceData.coords};
      this.all_user_data = raceData.users_data as Array<FeedObj>;
      this.followedIDs = raceData.followedIDs;

      console.log('COORDS:',this.coords);
      console.log("ALL USER DATA", this.all_user_data);
      console.log("FOLLOWER IDS", this.followedIDs);
    });


    this.raceService.getRaceAbout(this.raceID).then((resp) => {
      console.log('RESP FROM ABOUT SERVER:',resp);
      resp = resp as any;
      this.aboutData = resp['about_info'] as AboutData;
      this.raceSettings = resp['race_settings'];
      this.isOwner = resp['isOwner'];
      this.hasJoined = resp['hasJoined'];

      this.initializeForm();
    });

    
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  initializeForm(): void {
    this.AboutForm = new FormGroup({
      name: new FormControl(this.aboutData.name,[
        Validators.required,
        Validators.maxLength(30)
      ]),
      description: new FormControl(this.aboutData.description,[
        Validators.required
      ]),
      raceImage: new FormControl(''),
      rules: new FormGroup({
        isManual: new FormControl(this.raceSettings.isManualEntry),
        allowTeams: new FormControl(this.raceSettings.allowTeams),
        maxTeamSize: new FormControl(this.raceSettings.max_team_size,[
          Validators.max(10)
        ])
      })
    });

  }

  viewRace() {
    // set race in race service

    this.router.navigate(['/race',{name:this.raceName,id:this.raceID}]);
  }

  
  showModal(id:string): void {
    console.log(id);
    ($(id) as any).modal('show');
  }

  hideModal(id:string): void {
    ($(id) as any).modal('hide');
  }

  confirmRegistration(user:any): void {
    // login user
    console.log('USER CONFIRMED:',user);
    this._userService.login(user).subscribe(data => {
      console.log(data);
      localStorage.setItem('access_token', data['token']);
      localStorage.setItem('loggedInUsername', user.username);
      this.joinRace();
      location.reload();
    },
    err => {

    });
  }

  joinRace() {
    let race_id = this.raceID

    if(!localStorage.getItem('loggedInUsername')) {
      // route to landing page
      this.showModal('#registerModal');
    }

    this.raceService.joinRace(race_id).then((res) => {
      console.log('RES FROM JOIN:',res);
      this.router.navigate(['/race',{name:this.raceName,id:race_id}]);
    });
  }

  update(): void {
    let formClean = this.AboutForm.value as any;
    console.log(this.AboutForm);
    let isValid: Boolean = this.AboutForm.valid;

    formClean.raceImage = this.uploadeUrl;
    formClean.rules.race_id = this.raceSettings.race_id;
    console.log('IS VALID:',formClean);
    //this.coords = this._raceview.coords;
    

    if(isValid) {
      this.raceService.updateRaceAbout(formClean,this.raceID).then((resp) => {
        this.aboutData = resp['about_info'] as AboutData;
        this.raceSettings = resp['race_settings'] as RaceSettings;
        this.initializeForm();
        this.toggleForm();
      });
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadeUrl = reader.result;
      }
    }
  }

}

export interface AboutData {
  name:string;
  description:string;
  owner:any;
  race_image:string;
}

interface Event {
  target:any
}

export interface RaceSettings {
  isManualEntry:Boolean;
  allowTeams:Boolean;
  race_id:number;
  max_team_size:number;
}

interface RaceData {
  progress:any;
  activities:any;
  coords:any;
  leaderboard:any;
  users_data:any;
  settings:any;
  race_settings:RaceSettings;
  user_stat:any;
  followedIDs:number[];
}

interface FeedObj {
  user_id: number;
  display_name: string;
  profile_url:string
  joined: boolean;
  traveled: boolean;
  story: boolean;
  story_image:string;
  story_text:string;
  total_distance:number;
  last_distance:number;
  message: string;
  created_ts:number;
}

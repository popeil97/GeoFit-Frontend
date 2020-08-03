import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';
declare var $: any
import { MapComponent } from '../map/map.component';
import { SignupComponent } from '../signup/signup.component';
import { LeaderboardItem } from '../leaderboard/leaderboard.component';
import { CountdownModule } from 'ngx-countdown';

@Component({
  selector: 'app-race-about',
  templateUrl: './race-about.component.html',
  styleUrls: ['./race-about.component.css']
})
export class RaceAboutComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(SignupComponent) signupChild: SignupComponent;
  public AboutForm: FormGroup;
  aboutData:AboutData;
  raceSettings:RaceSettings = {} as RaceSettings;
  showForm: Boolean;
  raceName:string;
  raceID:number;
  uploadeUrl:any;
  teamSizeOptions = [2,3,4,5,6,7,8,9,10];
  isOwner: Boolean;
  hasJoined: Boolean;
  public leaderboard:LeaderboardItem[];
  public coords:any;
  public all_user_data:Array<FeedObj>;
  public followedIDs:number[];
  hasPaid:Boolean;
  hasMerch:Boolean;
  popup:Boolean;

  public num_users:any;

  constructor(private raceService:RaceService, 
              private route:ActivatedRoute, 
              private router:Router, 
              public _authService: AuthService,) { }

  ngAfterViewInit(): void {
    while(!this.aboutData);
    if(this.popup) {
      console.log('in here');
      this.signupChild.openDialog();
    }
  }

  ngOnInit() {

    this.showForm = false;

    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
      this.popup = params['params']['popup'];

      console.log('POPUP:',this.popup);

      
    });

    this.raceService.getRace(this.raceID).subscribe(data => {

      let raceData = data as RaceData;
      this.coords = raceData.coords;
      this.all_user_data = raceData.users_data as Array<FeedObj>;
      this.followedIDs = raceData.followedIDs;
      this.leaderboard = this.configureLeaderboard(raceData.unranked_leaderboard,raceData.ranked_leaderboard);
    });


    this.raceService.getRaceAbout(this.raceID).then((resp) => {
      resp = resp as any;
      this.aboutData = resp['about_info'] as AboutData;
      this.raceSettings = resp['race_settings'];
      this.isOwner = resp['isOwner'];
      this.hasJoined = resp['hasJoined'];
      this.hasPaid = resp['hasPaid'];
      this.hasMerch = this.raceSettings.has_swag;

      this.initializeForm();
    });

    

    
  }

  trySignup(): void {
    if(!this._authService.isLoggedIn()) {
      this.signupChild.closeDialog();
      this.router.navigate(['/register',{params:JSON.stringify({redirectParams: {name:this.raceName,id:this.raceID,popup:true}, redirectUrl:'/about'})}]);
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }


  configureLeaderboard(ranked:any[],unranked:any[]) {

    return unranked.concat(ranked)



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
        ]),
        paymentRequired: new FormControl(this.raceSettings.paymentRequired),
        price: new FormControl(this.raceSettings.price),
        hasSwag: new FormControl(this.raceSettings.has_swag),
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
    this._authService.login(user).subscribe(data => {
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

    if(!formClean.rules.paymentRequired) {
      formClean.rules.price = null;
    }
    

    if(isValid) {
      this.raceService.updateRaceAbout(formClean,this.raceID).then((resp) => {
        this.aboutData = resp['about_info'] as AboutData;
        this.raceSettings = resp['race_settings'] as RaceSettings;
        this.hasMerch = this.raceSettings.has_swag;
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
  race_type:any;
  start_loc:any;
  end_loc:any;
  distance:any;
  distance_type:any;
  start_date:any;
  end_date:any;
}

interface Event {
  target:any
}

export interface RaceSettings {
  isManualEntry:Boolean;
  allowTeams:Boolean;
  race_id:number;
  max_team_size:number;
  paymentRequired: Boolean,
  price:any,
  has_swag:Boolean,
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
  unranked_leaderboard:any[];
  ranked_leaderboard:any[];
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

import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';
declare var $: any
import { MapComponent } from '../map/map.component';
import { SignupComponent } from '../signup/signup.component';
import { SwagComponent } from '../swag/swag.component';
import { TagType } from '../tags.service';
import { ModalService } from '../modalServices';

@Component({
  selector: 'app-race-about',
  templateUrl: './race-about.component.html',
  styleUrls: ['./race-about.component.css']
})
export class RaceAboutComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(SignupComponent) signupChild: SignupComponent;
  @ViewChild(SwagComponent) swagChild: SwagComponent;
  public AboutForm: FormGroup;
  aboutData:AboutData;
  raceSettings:RaceSettings = {} as RaceSettings;
  showForm: Boolean;

  //Race info
  raceName:string;
  raceID:number;
  //Includes race IDs of child races if present
  raceIDs:number[];

  uploadeUrl:any;
  teamSizeOptions = [2,3,4,5,6,7,8,9,10];
  isOwner: Boolean;
  isModerator: Boolean;
  hasJoined: Boolean;
  public coords:any;
  public all_user_data:Array<FeedObj>;
  public followedIDs:number[];
  // hasPaid:Boolean;
  hasMerch:Boolean;
  popup:Boolean;
  hasStarted:Boolean;
  tagType = TagType.ENTRY;

  public num_users:any;


  constructor(private raceService:RaceService, 
              private route:ActivatedRoute, 
              private router:Router, 
              public _authService: AuthService,
              private modalService: ModalService,) { }

  ngAfterViewInit(): void {
    while(!this.aboutData);
    if(this.popup && this._authService.isLoggedIn()) {
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
      this.followedIDs = raceData.followedIDs;
      this.raceIDs = raceData.race_IDs;
      console.log("Race IDs: ", this.raceIDs);
    });


    this.raceService.getRaceAbout(this.raceID).then((resp) => {
      resp = resp as any;
      console.log('RESP FROM ABOUT SERVER:',resp);
      this.aboutData = resp['about_info'] as AboutData;
      this.raceSettings = resp['race_settings'];
      this.isOwner = resp['isOwner'];
      this.isModerator = resp['isModerator'];
      this.hasJoined = resp['hasJoined'];
      // this.hasPaid = resp['hasPaid'];
      this.hasStarted = resp['hasStarted'];
      this.hasMerch = this.raceSettings.has_swag;

      this.initializeForm();
    });

    

    
  }

  openModal(id: string) {
    this.modalService.open(id);
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
        hasEntryTags: new FormControl(this.raceSettings.has_entry_tags)
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

  // confirmRegistration(user:any): void {
  //   // login user
  //   console.log('USER CONFIRMED:',user);
  //   this._authService.login(user).subscribe(data => {
  //     console.log(data);
  //     localStorage.setItem('access_token', data['token']);
  //     localStorage.setItem('loggedInUsername', user.username);
  //     this.joinRace();
  //     location.reload();
  //   },
  //   err => {

  //   });
  // }

  joinRace(registrationBody:any) {

    if(!localStorage.getItem('loggedInUsername')) {
      // route to landing page
      this.showModal('#registerModal');
    }

    this.raceService.joinRace(registrationBody).then((res) => {
      console.log('RES FROM JOIN:',res);
      // this.router.navigate(['/race',{name:this.raceName,id:race_id}]);
    });
  }

  signupCallback(registrationBody:any) {
    // prompt for swag
    // then join race

    console.log('IN CALL BACK');

    this.joinRace(registrationBody);

    if(this.hasMerch) {
      this.swagChild.openDialog();
    }

    
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

  goToRaceDashboard(){
    this.router.navigate(['/dashboard',{name:this.raceName,id:this.raceID}]);
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
  num_children:any;
  is_hybrid:any;
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
  has_entry_tags:Boolean,
}

interface RaceData {
  progress:any;
  activities:any;
  settings:any;
  race_settings:RaceSettings;
  user_stat:any;
  followedIDs:number[];
  is_mod_or_owner:boolean;
  race_IDs: number[];
}

interface FeedObj {
  user_id: number;
  display_name: string;
  username: string;
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

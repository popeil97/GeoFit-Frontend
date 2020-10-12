import { Component, OnInit,ViewChild } from '@angular/core';
import { FormControl,FormGroup, Validators } from '@angular/forms';
import { RaceService } from '../race.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserProfileService } from '../userprofile.service';
declare var $: any
import { MapComponent } from '../map/map.component';
import { SwagComponent } from '../swag/swag.component';
import { TagType } from '../tags.service';
import { ModalService } from '../modalServices';

@Component({
  selector: 'app-race-about-page',
  templateUrl: './race-about-page.component.html',
  styleUrls: ['./race-about-page.component.css']
})
export class RaceAboutPageComponent implements OnInit {
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(SwagComponent) swagChild: SwagComponent;
  public AboutForm: FormGroup;
  
  aboutData:AboutData = null;
  raceSettings:RaceSettings = null as RaceSettings;
  showForm: Boolean;
  
  count:number=1;

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
  userData: UserData;

  public currentScreen = 'map';
  public acceptedScreens = ['map','logistics','race_director'];

  private monthKey = {
    '1':'Jan.',
    '2':'Feb.',
    '3':'Mar.',
    '4':'Apr.',
    '5':'May',
    '6':'June',
    '7':'July',
    '8':'Aug.',
    '9':'Sep.',
    '10':'Oct.',
    '11':'Nov.',
    '12':'Dec.',
  }


  constructor(
    private raceService:RaceService, 
    private route:ActivatedRoute, 
    private router:Router, 
    public _authService: AuthService,
    private modalService: ModalService,
    private _userProfileService:UserProfileService,
  ) {}

  ngAfterViewInit(): void {
    while(!this.aboutData);
    if(this.popup && this._authService.isLoggedIn()) {
      //console.log('in here');
      // this.signupChild.openDialog();
    }
  }

  ngOnInit() {
    // Debugging
    var _this = this;
    // Hides some kind of form. Dunno what it is yet, but we'll figure it out
    this.showForm = false;
    // I still don't know what this does, but I suspect it's to parse the parameters of the current URL
    this.route.paramMap.subscribe(params => {
      _this.raceName = params['params']['name'];
      _this.raceID = params['params']['id'];
      _this.popup = params['params']['popup'];

      // Console.log debug
      //console.log('Race ID', _this.raceID);
      //console.log('POPUP:', _this.popup);

      // I HOPE YOU REALIZE THAT this.raceID IS SET ONLY INSIDE OF THE PROMISE RESULT OF paramMap.subscribe AND THUS HAS TO BE PUT INSIDE THE PROMISE OUTPUT FUNCTION...
      // Get information about this race
      //... I'm confused about the difference between getRace and getRaceAbout. Shouldn't they be within the same API call?
      _this.raceService.getRace(_this.raceID).subscribe(data => {
        let raceData = data as RaceData;
        _this.followedIDs = raceData.followedIDs;
        _this.raceIDs = raceData.race_IDs;
        console.log("Race IDs: ", _this.raceIDs);
      });
      
      // Get information about this particular rase
      _this.raceService.getRaceAbout(_this.raceID).then((resp) => {
        resp = resp as any;
        //console.log('RESP FROM ABOUT SERVER:',resp);
  
        _this.aboutData = resp['about_info'] as AboutData;
        _this.aboutData.start_date = _this.ProcessDate(_this.aboutData.start_date);
        _this.aboutData.end_date = _this.ProcessDate(_this.aboutData.end_date);
  
        _this.raceSettings = resp['race_settings'];
        _this.isOwner = resp['isOwner'];
        _this.isModerator = resp['isModerator'];
        _this.hasJoined = resp['hasJoined'];
        // _this.hasPaid = resp['hasPaid'];
        _this.hasStarted = resp['hasStarted'];
        _this.hasMerch = _this.raceSettings.has_swag;
  
        _this.initializeForm();
        _this.getOwnerData();
      });
    });

    document.getElementById('map-btn').style.backgroundColor = "#36343c";
    document.getElementById('map-btn').style.color = "#FFFFFF";
    console.log("race-about-page:race-id", this.raceID);
  }

  ProcessDate = (date = null) => {
    if (date == null) return {month:null,day:date}
    var d = new Date(date);
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    return {month:this.monthKey[month],day:day}
  }


  openModal(id: string) {

    const data = (id == 'custom-modal-2') ? {register:true, price:this.raceSettings.price,race_id:this.raceID,hasJoined:this.hasJoined,hasStarted:this.hasStarted,hasTags: this.raceSettings.has_entry_tags} :(id == 'custom-modal-3') ? {price:this.raceSettings.price,race_id:this.raceID,hasJoined:this.hasJoined,hasStarted:this.hasStarted,hasTags: this.raceSettings.has_entry_tags} : null;
    //console.log("MODAL DATA", data);
    this.modalService.open(id,data);
  }

  closeModal(id: string) {
      this.modalService.close(id);
  }

  
  SwitchSlideshow = (to:string = null) => {
    //console.log("to", to, this.acceptedScreens.indexOf(to));
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;

     document.getElementById(to+'-btn').style.backgroundColor = "#36343c";
     document.getElementById(to+'-btn').style.color = "#FFFFFF";

    switch(to) { 
     case 'map': { 
       document.getElementById('logistics-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('logistics-btn').style.color = "#000000";
       document.getElementById('race_director-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('race_director-btn').style.color = "#000000";
        break; 
     } 
     case 'logistics': { 
        document.getElementById('map-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('map-btn').style.color = "#000000";
       document.getElementById('race_director-btn').style.backgroundColor = "#FFFFFF";
       document.getElementById('race_director-btn').style.color = "#000000";
        break; 
     } 
     case 'race_director': { 
         document.getElementById('logistics-btn').style.backgroundColor = "#FFFFFF";
         document.getElementById('logistics-btn').style.color = "#000000";
         document.getElementById('map-btn').style.backgroundColor = "#FFFFFF";
          document.getElementById('map-btn').style.color = "#000000";
        break; 
     } 
     default: { 
        break; 
     } 
   }

    return;
  }

  trySignup(): void {
    if(!this._authService.isLoggedIn()) {
      // this.signupChild.closeDialog();
      this.router.navigate(['/register',{params:JSON.stringify({redirectParams: {name:this.raceName,id:this.raceID,popup:true}, redirectUrl:'/about'})}]);
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }


  initializeForm = () => {
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

  getOwnerData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    //console.log('race-about-page - getUserData()',this.aboutData.owner);
    this._userProfileService.getUserProfile(this.aboutData.owner.username).then((data) => {
      this.userData = data as UserData;
      this.userData.email_mailto = `mailto:${this.userData.email}`;
      //console.log("New user data race about pg: ", this.userData);
    });
  }

  viewRace() {
    // set race in race service

    this.router.navigate(['/race',{name:this.raceName,id:this.raceID}]);
  }

  
  showModal(id:string): void {
    //console.log(id);
    ($(id) as any).modal('show');
  }

  hideModal(id:string): void {
    ($(id) as any).modal('hide');
  }

  // confirmRegistration(user:any): void {
  //   // login user
  //   //console.log('USER CONFIRMED:',user);
  //   this._authService.login(user).subscribe(data => {
  //     //console.log(data);
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
      //console.log('RES FROM JOIN:',res);
      // this.router.navigate(['/race',{name:this.raceName,id:race_id}]);
    });
  }

  signupCallback(registrationBody:any) {
    // prompt for swag
    // then join race

    //console.log('IN CALL BACK');

    this.joinRace(registrationBody);

    if(this.hasMerch) {
      this.swagChild.openDialog();
    }

    
  }

  update(): void {
    let formClean = this.AboutForm.value as any;
    //console.log(this.AboutForm);
    let isValid: Boolean = this.AboutForm.valid;

    formClean.raceImage = this.uploadeUrl;
    formClean.rules.race_id = this.raceSettings.race_id;
    //console.log('IS VALID:',formClean);
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
        //console.log("RACE ABOUT", this.aboutData);
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


interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  description: string;
  location:string;
  first_name:string;
  last_name:string;
  follows:boolean;
  distance_type: string;
  is_me: boolean;
  location_visibility:boolean;
  about_visibility:boolean;
  email_visibility:boolean;
  email_mailto:string;
}

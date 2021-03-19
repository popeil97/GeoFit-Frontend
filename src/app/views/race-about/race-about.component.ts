import { Component, OnInit,ViewChild,OnDestroy} from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { 
  AuthService,
  RaceService,
  UserProfileService,
  MapService,
} from '../../services';
import {
  UserData,
} from '../../models';
declare var $: any
import { MapComponent } from '../../map/map.component';
import { SwagComponent } from '../../swag/swag.component';
import { UsersService } from '../../users.service';

import { MatDialog } from '@angular/material';
import { RegisterComponent } from '../register/register.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';
import { RaceTypeComponent } from '../../race-type/race-type.component';

@Component({
  selector: 'app-race-about',
  templateUrl: './race-about.component.html',
  styleUrls: ['./race-about.component.css']
})

export class RaceAboutComponent implements OnInit,OnDestroy {
  
  @ViewChild(MapComponent) mapChild: MapComponent;
  @ViewChild(SwagComponent) swagChild: SwagComponent;

  //Race info
  raceID:number;
  // hasPaid:Boolean;
  popup:Boolean;

  public userData: UserData;
  private userDataSubscription:any = null;

  public currentScreen = 'map';
  private acceptedScreens = ['map','logistics','race_director'];

  public raceData:any = {
    loading:true,
    headerInfo:{},
    race_image:null,
    owner:{},
    raceSettings:{},
    mapData:{},
    userDetails:{},
  };

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
    private _userProfileService:UserProfileService,
    private _mapService: MapService,
    private _usersService:UsersService,
    private _raceService:RaceService,
    private dialog : MatDialog,
  ) {
    this.userData = this._authService.userData;
    this.userDataSubscription = this._authService.userDataChange.subscribe(this.handleUserDataChange);
  }

  ngOnInit() {
    this.initializePage();
  }

  ngOnDestroy() {
    this.raceData = {
      loading:true,
      headerInfo:{},
      owner:{},
      race_image:null,
      raceSettings:{},
      mapData:{},
      userDetails:{},
    };
    this.userData = null;
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
      this.userDataSubscription = null;
    }
  }

  handleUserDataChange = (data:UserData) => {
    this.userData = data;
    this.initializePage();
  }

  initializePage = () => {
    const ProcessDate = (date = null) => {
      if (date == null) return {month:null,day:date}
      var d = new Date(date);
      var month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();
      return {month:this.monthKey[month],day:day}
    }

    // I still don't know what this does, but I suspect it's to parse the parameters of the current URL
    this.route.paramMap.subscribe(params => {
      this.raceID = params['params']['id'];
      this.popup = params['params']['popup'];

      // I HOPE YOU REALIZE THAT this.raceID IS SET ONLY INSIDE OF THE PROMISE RESULT OF paramMap.subscribe AND THUS HAS TO BE PUT INSIDE THE PROMISE OUTPUT FUNCTION...
      // Get information about this race
      //... I'm confused about the difference between getRace and getRaceAbout. Shouldn't they be within the same API call?
      
      Promise.all([
        this.raceService.getRacePromise(this.raceID),
        this.raceService.getRaceAbout(this.raceID),
        this._usersService.getLogos(this.raceID),
      ]).then((responses:any)=>{

        const getRaceData = responses[0],
              getRaceAboutData = responses[1],
              getLogosData = responses[2];
                
        // Set the race's ID number
        this.raceData.raceID = getRaceData.race.id;

        // Set the race's header info
        this.raceData.headerInfo = {
          name:getRaceData.race.name,
          description:getRaceData.race.description,
          dates:{
            startDate:ProcessDate(getRaceData.race.start_date),
            endDate:ProcessDate(getRaceData.race.end_date),
          }
        }

        // Set the race's owner data
        const aboutData = getRaceAboutData['about_info'] as AboutData;
        this.raceData.owner = aboutData.owner;
        this._userProfileService.requestUserProfile(this.raceData.owner.username).then((data) => {
          const ownerData = data as UserData;
          this.raceData.owner.email_mailto = `mailto:${ownerData.email}`;
          this.raceData.owner.profile_url = ownerData.profile_url;
          this.raceData.owner.description = (ownerData.description && ownerData.description.length > 0) ? ownerData.description : "No description available";
        });

        // Set the race's banner image
        this.raceData.race_image = aboutData.race_image;

        // Set some race settings data initially
        enum raceTypeMap {
          Running = 1,
          Biking = 2,
        }
        
        // Set the race's settings data
        const settings = getRaceAboutData['race_settings'];
        this.raceData.raceSettings = {
          allowTeams:settings.allow_teams,
          maxTeamSize:settings.max_team_size,
          isManualEntry:settings.isManualEntry,
          isHybrid:aboutData.is_hybrid,
          raceType:aboutData.race_type,
          price:settings.price,
          hasEntryTags:settings.has_entry_tags,
          typeText:(aboutData.is_hybrid)
            ? `Hybrid ${raceTypeMap[aboutData.race_type]}`
            : `Virtual ${raceTypeMap[aboutData.race_type]}`,
          teamsText:(settings.allow_teams)
            ? `Teams of up to ${settings.max_team_size} can be formed on race day.`
            : "No teams are allowed for this race.",
          requirementsText:(settings.isManualEntry)
            ? "NONE however, the Strava mobile app is highly recommended for tracking fitness activities!" 
            : "Download Strava from the app store to track your fitness activities",
          priceText:(parseFloat(settings.price)>0)
            ? `${settings.price}`
            : "Free"
        };

        // Setting the race's map data
        this.raceData.mapData = {
          raceIDs:getRaceData.race_IDs,
          trails:null,
          startLoc:aboutData.start_loc,
          endLoc:aboutData.end_loc,
          distance:aboutData.distance,
          numChildren:aboutData.num_children,
          hasStarted:getRaceAboutData.hasStarted,
        }
        let trails = [];
        this.raceData.mapData.raceIDs.forEach((id:number)=>{
          this._mapService.getMapTrail(id).then((routeData) => {
            let mapData = routeData as RouteData;
            trails.push(mapData.name);     
          });
        });
        this.raceData.mapData.trails = trails;

        // Setting user-specific details
        this.raceData.userDetails = {
          hasJoined:getRaceAboutData.hasJoined,
          isModerator:getRaceAboutData.isModerator,
          isOwner:getRaceAboutData.isOwner,
          followedIDs:getRaceData.followedIDs,
        }

        this.raceData.loading = false;
        console.log("RACE DATA:",this.raceData);
      }).catch((errors:any)=>{
        console.error(errors);
      });

      /*
      this.raceService.getRacePromise(this.raceID).then((data) => {
        const _raceData = data as RaceData;
        const headerInfo = {
          name:_raceData.race.name,
          description:_raceData.race.description,
          dates:{
            startDate:ProcessDate(_raceData.race.start_date),
            endDate:ProcessDate(_raceData.race.end_date),
          }
        }
        this.raceData.headerInfo = headerInfo;

        
        /// this.raceData = data as RaceData;
        console.log("Race Data Response:",data);

        this.followedIDs = this.raceData.followedIDs;
        this.raceIDs = this.raceData.race_IDs;
        console.log("Child Race IDs: ", this.raceIDs);

        console.log("RACE ID LEN",  this.raceIDs.length);
        for (let i = 0; i < this.raceIDs.length; i++) {
          let raceID = this.raceIDs[i];
          console.log("RACE ID", raceID);


          this._mapService.getMapTrail(raceID).then((data) => {
            let mapData = data as RouteData;
           this.trails.push(mapData.name);
           console.log("ROUTE", mapData.name);        
          });
        };
      }).catch(getRaceError=>{
        console.error(getRaceError);
        alert("Error getting race basic information");
      });
      
      // Get information about this particular rase
      this.raceService.getRaceAbout(this.raceID).then((resp) => {
        resp = resp as any;
        console.log('RESP FROM ABOUT SERVER:',resp);
  
        this.aboutData = resp['about_info'] as AboutData;

        this.raceData.race_image = this.aboutData.race_image;
        this.raceData.owner = this.aboutData.owner;
        this._userProfileService.requestUserProfile(this.raceData.owner.username).then((data) => {
          const ownerData = data as UserData;
          this.raceData.owner.email_mailto = `mailto:${ownerData.email}`;
          this.raceData.owner.profile_url = ownerData.profile_url;
          this.raceData.owner.description = (ownerData.description && ownerData.description.length > 0) ? ownerData.description : "No description available";
        });
  
        const settings = resp['race_settings'];
        this.raceData.raceSettings = {
          allowTeams:settings.allow_teams,
          maxTeamSize:settings.max_team_size,
          isManualEntry:settings.isManualEntry,
          isHybrid:settings.
          teamsText:(settings.allow_teams)
            ? `Teams of up to ${settings.max_team_size} can be formed on race day.`
            : "No teams are allowed for this race.",
          requirementsText:(settings.isManualEntry)
            ? "NONE however, the Strava mobile app is highly recommended for tracking fitness activities!" 
            : "Download Strava from the app store to track your fitness activities",
        }

        this.isOwner = resp['isOwner'];
        this.isModerator = resp['isModerator'];
        this.hasJoined = resp['hasJoined'];
        // _this.hasPaid = resp['hasPaid'];
        this.hasStarted = resp['hasStarted'];

        this.hasMerch = this.raceSettings.has_swag;
  
        this.initializeForm();
      }).catch(getRaceAboutError=>{
        console.error(getRaceAboutError);
        alert("Error getting race details");
      });
    });

      this._usersService.getLogos(this.raceID).then((data)=>{
        this.logos = data as Logo;
        this.raceLogos = this.logos.raceLogos;
        console.log("LOGOS:", this.logos);
      });
    */ 
    });
  }

  /*
  openModal(id: string) {
    console.log("Logo outside...",this.logos);
    if(!this._authService.isLoggedIn() || this.raceSettings.price>0) //user is NOT logged in
    {
      const data = (id == 'custom-modal-2') ? {register:true, price:this.raceSettings.price,race_id:this.raceID,hasJoined:this.hasJoined,hasStarted:this.hasStarted,hasTags: this.raceSettings.has_entry_tags} :(id == 'custom-modal-3') ? {price:this.raceSettings.price,race_id:this.raceID,hasJoined:this.hasJoined,hasStarted:this.hasStarted,hasTags: this.raceSettings.has_entry_tags} : null;
      //console.log("MODAL DATA", data);
      this.modalService.open(id,data);
    }
    else //user is logged in and price = 0;
    {
      //add race stat then...
      let registrationBody = {race_id:this.raceID} as any;
      this._raceService.joinRace(registrationBody);
      this.router.navigate(['/welcome']);
    }
  }
  */

  openRegister = () => {
    if (this.raceData.loading) return;
    if(!this._authService.isLoggedIn()) {
      //user is NOT logged in
      const data = {
        register:true, 
        price:this.raceData.raceSettings.price,
        race_id:this.raceData.raceID,
        hasJoined:this.raceData.userDetails.hasJoined,
        hasStarted:this.raceData.userDetails.hasStarted,
        hasTags: this.raceData.raceSettings.has_entry_tags,
      };
      const d = this.dialog.open(RegisterComponent,{
        panelClass:"RegisterContainer",
        data: data
      });
      const subLogin = d.componentInstance.openLogin.subscribe(()=>{
        this.openLogin();
      });
      const subSignUp = d.componentInstance.openSignUp.subscribe(()=>{
        this.openSignUp();
      })
      d.afterClosed().subscribe(result=>{
        console.log("Closing Register from Race About");
        if (typeof result !== "undefined") console.log(result);
        subLogin.unsubscribe();
        subSignUp.unsubscribe();
      })
    }
    else if (this.raceData.raceSettings.price == 0) //user is logged in and price = 0;
    {
      //add race stat then...
      let registrationBody = {race_id:this.raceData.raceID} as any;
      this._raceService.joinRace(registrationBody);
      this.router.navigate(['/welcome']);
    } else {
      // We're now opening the official sign-up form
      const data = {
        price:this.raceData.raceSettings.price,
        race_id:this.raceData.raceID,
        hasJoined:this.raceData.userDetails.hasJoined,
        hasStarted:this.raceData.userDetails.hasStarted,
        hasTags: this.raceData.raceSettings.has_entry_tags,
      };
      const d = this.dialog.open(SignupComponent,{
        panelClass:"SignUpContainer",
        data: data
      });
      d.afterClosed().subscribe(result=>{
        console.log("Closing Sign Up from Race About");
        if (typeof result !== "undefined") console.log(result);
      });
    }
  }

  openSignUp = () => {
    if (this.raceData.loading) {
      return;
    }
    if(!this._authService.isLoggedIn()) {
      //user is NOT logged in
      const data = {
        price:this.raceData.raceSettings.price,
        race_id:this.raceData.raceID,
        hasJoined:this.raceData.userDetails.hasJoined,
        hasStarted:this.raceData.userDetails.hasStarted,
        hasTags: this.raceData.raceSettings.has_entry_tags,
      };
      const d = this.dialog.open(RegisterComponent,{
        panelClass:"RegisterContainer",
        data: data
      });
      const loginSub = d.componentInstance.openLogin.subscribe(()=>{
        this.openLogin();
      });
      const signUpSub = d.componentInstance.openSignUp.subscribe(()=>{
        this.openSignUp();
      })
      d.afterClosed().subscribe(result=>{
        console.log("Closing Sign Up from Race About");
        if (typeof result !== "undefined") console.log(result);
        loginSub.unsubscribe();
        signUpSub.unsubscribe();
      });
    }
    else if (this.raceData.raceSettings.price == 0) {
      //user is logged in and price = 0;
      //add race stat then...
      let registrationBody = {race_id:this.raceData.raceID} as any;
      this._raceService.joinRace(registrationBody);
      this.router.navigate(['/welcome']);
    }
    else {
      // We're now opening the official sign-up form
      const data = {
        price:this.raceData.raceSettings.price,
        race_id:this.raceData.raceID,
        hasJoined:this.raceData.userDetails.hasJoined,
        hasStarted:this.raceData.userDetails.hasStarted,
        hasTags: this.raceData.raceSettings.has_entry_tags,
      };
      const d = this.dialog.open(SignupComponent,{
        panelClass:"SignUpContainer",
        data: data
      });
      d.afterClosed().subscribe(result=>{
        console.log("Closing Sign Up from Race About");
        if (typeof result !== "undefined") console.log(result);
      });
    }
  }

  openLogin = () => {
    if (this.raceData.loading) return;
    if (!this._authService.isLoggedIn()) {
      // User is NOT logged in
      const data = {
        register:true, 
        price:this.raceData.raceSettings.price,
        race_id:this.raceData.raceID,
        hasJoined:this.raceData.userDetails.hasJoined,
        hasStarted:this.raceData.userDetails.hasStarted,
        hasTags: this.raceData.raceSettings.has_entry_tags,
      };
      const d = this.dialog.open(LoginComponent,{
        panelClass:"LoginContainer",
        data: data,
      });
      const subRegister = d.componentInstance.openRegister.subscribe(()=>{
        this.openRegister();
      });
      const subSignUp = d.componentInstance.openSignUp.subscribe(()=>{
        this.openSignUp();
      })
      d.afterClosed().subscribe(result=>{
        console.log('Closing Login on Race About');
        if (typeof result !== "undefined") console.log(result);
        subRegister.unsubscribe();
        subSignUp.unsubscribe();
      })
    }
  }

  openRaceTypesPopup = () => {
    this.dialog.open(RaceTypeComponent,{
      panelClass:"DialogDefaultContainer"
    });
  }

  /*
  closeModal(id: string) {
      this.modalService.close(id);
  }
  */

  SwitchSlideshow = (to:string = null) => {
    if (to == null || this.acceptedScreens.indexOf(to) == -1) return;
    this.currentScreen = to;
  }

  /*
  trySignup(): void {
    if(!this._authService.isLoggedIn()) {
      // this.signupChild.closeDialog();
      this.router.navigate(['/register',{params:JSON.stringify({redirectParams: {name:this.raceData.headerInfo.name,id:this.raceData.raceID,popup:true}, redirectUrl:'/about'})}]);
    }
  }
  */

  /*
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
  */

  viewRace() {
    // set race in race service
    this.router.navigate(['/race',{name:this.raceData.headerInfo.name,id:this.raceData.raceID}]);
  }

  viewAboutTucan() {
    // set race in race service
    this.router.navigate(['/for-racers']);
    window.scrollTo(0, 0);
  }

  /*
  showModal(id:string): void {
    //console.log(id);
    ($(id) as any).modal('show');
  }

  hideModal(id:string): void {
    ($(id) as any).modal('hide');
  }
  */

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

  /*
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
  */

  /*
  signupCallback(registrationBody:any) {
    // prompt for swag
    // then join race

    //console.log('IN CALL BACK');

    this.joinRace(registrationBody);

    if(this.hasMerch) {
      this.swagChild.openDialog();
    }
  }
  */

  /*
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
      // formClean = {
      //    name:string,
      //    description:string,
      //    raceImage:image,
      //    rules:{
      //      race_id:number,
      //      price:number
      //      isManual:boolean,
      //      allowTeams:boolean,
       //     maxTeamSize:number,
      //      paymentRequired:boolean
      //      price:number,
      //      hasSwag:boolean,
      //      hasEntryTags:boolean,
      //    }
      //  }
      this.raceService.updateRaceAbout(formClean,this.raceID).then((resp) => {
        this.aboutData = resp['about_info'] as AboutData;
        this.raceSettings = resp['race_settings'] as RaceSettings;
        this.hasMerch = this.raceSettings.has_swag;
        this.initializeForm();
        //console.log("RACE ABOUT", this.aboutData);
      });
    }
  }
  */

  goToRaceDashboard(){
    this.router.navigate(['/dashboard',{id:this.raceData.raceID}]);
  }


}



interface Logo{
  raceLogos:string[];
}
interface RouteData {
  name: string;
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
  race:any;
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

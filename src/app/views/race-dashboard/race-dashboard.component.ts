import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';

import { RaceSettings } from '../race-about/race-about.component';

import { 
  AuthService,
  RaceService,
  ItemService,
} from '../../services';

import { 
  LoginComponent,
  RegisterComponent,
} from '../../popups';

@Component({
  selector: 'app-race-dashboard',
  templateUrl: './race-dashboard.component.html',
  styleUrls: ['./race-dashboard.component.css']
})
export class RaceDashboardComponent implements OnInit, OnChanges, OnDestroy {

  // public loading:Boolean = true;
  private loggedInSubscription:any = null;
  public loadingSegments = {
    navigation:true,
    content:true,
  }
  public raceID: number = null;
  public raceData: any = null;
  public page: string;
  public openedNavItem:string = null;

  public isOwnerOrMod:Boolean = false;

  public raceName: string;

  //Child race IDs (same as parent if no child IDs)
  public raceIDs:number[] = [];

  //Race ID of race info in current view
  public selectedRaceID: number;
  public selectedRaceName: string;

  //Info of all child races if present (else just parent race)
  public childRaceData: ChildRaceData[] = [];

  constructor(
    private route: ActivatedRoute,
    private raceService: RaceService,
    private authService:AuthService,
    private itemService:ItemService,
    private router:Router,
    private dialog:MatDialog,
  ) { }

  ngOnInit() {

    // We add a subscription to the login event
    this.loggedInSubscription = this.authService.getLoginStatus.subscribe(this.handleLoginChange);
    
    // this.loading = true;
    this.loadingSegments.navigation = true;
    this.loadingSegments.content = true;

    this.raceData = null;

    this.route.paramMap.subscribe(params => {
      // Get the race ID from the URL
      this.raceID = params['params']['id'];
      this.page = (params['params']['page']) ? params['params']['page'] : "admin";
      if (this.raceID) {
        // there was a race ID in the URL
        if (this.authService.isLoggedIn()) {
          this.loadingSegments.navigation = false;
          this.getRaceData();     // We are logged in
        } else {
          // this.loading = false;   // We aren't logged in
          this.loadingSegments.navigation = false;
          this.loadingSegments.content = false;
        }
      } else {
        // this.loading = false;     // There was no race ID in the url
        this.loadingSegments.navigation = false;
        this.loadingSegments.content = false;
      }
    });
    /*
    this.loading = true;
    this.route.paramMap.subscribe(params => {
      this.raceName = params['params']['name'];
      this.raceID = params['params']['id'];
      this.page = (params['params']['page']) ? params['params']['page'] : 'admin';

      //this.loadingSegments.navigation = false;
      if (this.authService.isLoggedIn()) {
        // We ARE logged in, so we gotta pull race data
        this.getRaceData();
      } else {
        // We aren't logged in - this will auto-default to the login/signup screen in the html
        // once they log in though, we'll need to prompt them to reload the data
        this.loading = false;
      }
    });
    */
  }

  ngOnChanges(changes: SimpleChanges) {
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        switch(propName) {
          case 'raceID':
            console.log("Getting race data");
            if (this.raceID){
              this.getRaceData();
            }
            break;
          case 'page':
            console.log('Page Change');
            break;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.loggedInSubscription) this.loggedInSubscription.unsubscribe();
  }

  openLogin = () => {
    const d = this.dialog.open(LoginComponent,{
      panelClass:"LoginContainer",
    });
    const sub = d.componentInstance.openRegister.subscribe(()=>{
      this.openRegister();
    })
    d.afterClosed().subscribe(result=>{
      console.log("Closing Login from Race Dashboard");
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }
  openRegister = () => {
    const d = this.dialog.open(RegisterComponent, {
      panelClass:"RegisterContainer",
    });
    const sub = d.componentInstance.openLogin.subscribe(() => {
      this.openLogin();
    });
    d.afterClosed().subscribe(result=>{
      console.log("Close Register from Race Dashboard")
      if (typeof result !== "undefined") console.log(result);
      sub.unsubscribe();
    })
  }
  navigateTo(url:string = null, params:any = null) {
    if (url != null) this.router.navigate([url,params]);
  }

  handleLoginChange = (loggedIn:Boolean) => {
    if (loggedIn) {
      // we've logged in
      if (this.raceID) {
        // race ID was provided, gotta grab data
        // this.loading = true;
        this.getRaceData();
      } else {
        // No Race ID was provided
        // this.loading = false;
        this.loadingSegments.content = false;
        this.raceData = null;
      }
    } else {
      // We've logged out
      // this.loading = false;
      this.loadingSegments.content = false;
      this.raceData = null;
    }
  }
  reloadData() {
    this.getRaceData();
  }
  private getRaceData = (callback:any = null) => {
    // this.loading = true;
    this.loadingSegments.content = true;

    Promise.all([
      this.raceService.getRacePromise(this.raceID), 
      this.raceService.getRaceAbout(this.raceID),
      this.itemService.getRaceItems(this.raceID),
      //this._mapService.getMapData(this.raceID)
    ]).then(res=>{
      let d0 = res[0] as RaceData,
          d1 = res[1] as RaceAboutData,
          d2 = res[2] as RaceItemData;
      console.log(d2);
          //d2 = res[2] as RouteData;
      if (!d0.is_mod_or_owner) {
        // this.loading = false;
        this.loadingSegments.content = false;
        this.raceData = null;
        this.isOwnerOrMod = false;
        return;
      }

      this.raceData = {
        id:d0.race.id,
        is_mod_or_owner:d0.is_mod_or_owner,
        is_owner:d1.isOwner,
        is_moderator:d1.isModerator,
        owner: {
          id:d1.about_info.owner.id,
          username:d1.about_info.owner.username,
          email:d1.about_info.owner.email,
          first_name:d1.about_info.owner.first_name,
          last_name:d1.about_info.owner.last_name,
        },
        basics:{
          name:d0.race.name,
          description:d0.race.description,
          startDate:d0.race.start_date,
          endDate:d0.race.end_date,
          bannerFile:(d1.about_info.race_image != null && d1.about_info.race_image.indexOf('default-race-img.png')>-1) ? null : d1.about_info.race_image,
          raceType:d0.race.race_type,
        },
        settings:{
          allow_teams:d0.race_settings.allowTeams,
          max_team_size:d0.race_settings.max_team_size,
          is_manual_entry:d0.race_settings.isManualEntry,
        },
        map:{
          name:d0.race.name,
          distance:d0.race.distance,
          distance_type:d0.race.distance_type,
          distance_units:d0.distance_units,
          start_loc: d0.race.start_loc,
          end_loc: d0.race.end_loc,
          start_lon: d0.race.start_lon,
          start_lat: d0.race.start_lat,
          end_lon: d0.race.end_lon,
          end_lat: d0.race.end_lat,
          valid_route_file: d0.race.valid_route_file,
          race_IDs:d0.race_IDs,
          child_races:d0.child_race_dict,
          num_children:d1.about_info.num_children,
        },
        finances:{
          payment_required:d0.race_settings.paymentRequired,
          price:d0.race_settings.price,
          has_swag:d0.race_settings.has_swag,
          has_entry_tags:d0.race_settings.has_entry_tags,
        },
        merchandise:{
          merchandise:d2.items.filter((item:any)=>{return item.type==2}),
          entries:d2.items.filter((item:any)=>{return item.type==1}),
        },
        public:d0.race.public,
        has_started:d1.hasStarted,
      }
    }).catch(errors=>{
      console.log(errors);
    }).finally(()=>{
      // this.loading = false;
      this.loadingSegments.content = false;
      console.log(this.raceData);
      if (callback) callback();
    })
  }
  public navigateToAdmin() {
    this.navigateTo('dashboard',{id:this.raceID})
  }
  public navigateToRaceBasics() {
    this.navigateTo('dashboard',{id:this.raceID,page:'basics'});
  }
  public navigateToSettings() {
    this.navigateTo('dashboard',{id:this.raceID,page:'settings'});
  }
  public navigateToMap() {
    this.navigateTo('dashboard',{id:this.raceID,page:'map'});
  }
  public navigateToMerchandise() {
    this.navigateTo('dashboard',{id:this.raceID,page:'merchandise'});
  }

  openNavItemContents(e:Event, to:string) {
    e.preventDefault();
    e.stopPropagation();
    var t = (this.openedNavItem == to) ? null : to
    this.openedNavItem = t;
  }

}

export interface ChildRaceData {
  id: number,
  name: string,
}

interface RaceData {
  progress:any;
  race:any;
  activities:any;
  settings:any;
  race_settings:RaceSettings;
  user_stat:any;
  followedIDs:number[];
  is_mod_or_owner:boolean;
  IDs_to_name: any;
  race_IDs: number[];
  child_race_dict: ChildRaceData[];
  distance_units:number;
  owner:any;
}
interface RaceAboutData {
  about_info:any;
  hasJoined:boolean;
  hasStarted:boolean;
  isModerator:boolean;
  isOwner:boolean;
  race_settings:any;
}
interface RaceItemData {
  items:any,
}

interface RouteData {
  name: string;
  coords: any;
  //route_pins: RoutePins[];
  //userData: UserData[];
  //org_pins: UserData[];
  //checkpoints: CheckpointMapData[];
}
interface PinSettings {
  followerPinsOnly: boolean;
  malePinsOn: boolean;
  femalePinsOn: boolean;
  allAgesOn: boolean;
  minAge: number;
  maxAge: number;
  showOrgPins: boolean;
}
interface RoutePins {
  title: string;
  desciption: string;
  lon: number;
  lat: number;
  image_urls: string[];
}
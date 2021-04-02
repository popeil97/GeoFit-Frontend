import { Component, OnInit, OnDestroy, ViewChild, } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatStepper } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import {
  AuthService,
  RaceService,
  SwagService,
  RouterService,
} from '../../services';

import {
  LoginComponent,
  TermsOfServiceComponent,
} from '../../popups';

import {
  TagType,
  Cart,
} from '../../interfaces';
import { Compiler_compileModuleSync__POST_R3__ } from '@angular/core/src/linker/compiler';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: [
    '../../../styles/forms.css',
    './confirm-signup.component.css'
  ]
})
export class ConfirmSignupComponent implements OnInit,OnDestroy {

  @ViewChild('stepper') public stepper: MatStepper;

  private loadingPage:Boolean = true;
  public firstSuccessfulLoading:Boolean = false;
  private userProfileSubscription:any = null;
 
  private raceID:number = null;
  private raceData:any = null;
  private userData:any = null;
  private maxStepperSteps:number = 1;
  public finalPrice:number = 0;
  public registrationSuccessful:Boolean = false;

  public tType = TagType.ENTRY;

  public tagForm: FormGroup = new FormGroup({
    tagID: new FormControl('',[
      Validators.required
    ]),
  });

  constructor(
    private route:ActivatedRoute,
    private dialog:MatDialog,
    private authService:AuthService,
    private raceService:RaceService,
    private swagService:SwagService,
    private routerService:RouterService,
  ) {}

  ngOnInit() {
    this.userProfileSubscription = this.authService.userDataChange.subscribe(this.handleUserDataChange);
    this.userData = this.authService.userData;
    this.route.paramMap.subscribe(params => {
      this.raceID = params['params']['id'];
      if (this.userData != null) this.initializeConfirmPage();
    });
  }

  ngOnDestroy() {
    if (this.userProfileSubscription != null) {
      this.userProfileSubscription.unsubscribe();
      this.userProfileSubscription = null;
    }
    this.userData = null;
    this.raceID = null;
    this.raceData = null;
  }

  private handleUserDataChange = (changedUserData:any):void => {
    this.userData = changedUserData;
    if (this.userData != null) {
      this.initializeConfirmPage();
    }
  }

  private initializeConfirmPage = ():void => {
    if (this.userData == null) {
      this.loadingPage = false;
      return;
    }
    this.loadingPage = true;
    this.firstSuccessfulLoading = true;
    Promise.all([
      this.raceService.getRacePromise(this.raceID),
      this.raceService.getRaceAbout(this.raceID),
      this.swagService.getItems(this.raceID),
      this.swagService.getCart(this.raceID),
    ]).then((responses:Array<any>)=>{

      const getRaceData = responses[0],
            getRaceAboutData = responses[1],
            getSwagData = responses[2],
            getSwagCart = responses[3];

      const aboutData = getRaceAboutData['about_info'] as AboutData,
            settings = getRaceAboutData['race_settings'],
            entryItems = getSwagData.items.filter((i:any)=>{return i.type==1}),
            merchandiseItems = getSwagData.items.filter((i:any)=>{return i.type==2});
                
      // Set the race's header info
      this.raceData = {
        name:getRaceData.race.name,
        description:getRaceData.race.description,
        public:getRaceData.race.public,
        race_image:aboutData.race_image,
        raceType:aboutData.race_type,
        hasEntryTags:settings.has_entry_tags,
        hasStarted:getRaceAboutData.hasStarted,
        hasJoined:getRaceAboutData.hasJoined,
        isModerator:getRaceAboutData.isModerator,
        isOwner:getRaceAboutData.isOwner,
        followedIDs:getRaceData.followedIDs,
        merchandise:{
          entries:entryItems,
          merchandise:merchandiseItems,
        },
        cart:getSwagCart['cart']
      };

      this.maxStepperSteps = 1;
      if (this.raceData.hasEntryTags) this.maxStepperSteps += 1;

      console.log("THIS RACE DATA:",this.raceData);

    }).catch((error:any)=>{
      console.error(error);
      this.raceData = null;
    }).finally(()=>{
      this.loadingPage = false;
    })
  }

  private openLogin = (e:any):void => {
    if (e) {
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
    }
    const d = this.dialog.open(LoginComponent,{
      panelClass:'LoginContainer',
    });
    d.afterClosed().subscribe((result)=>{
      console.log('LOGIN RESULT',result);
    });
  }

  refreshCart = (callback:any = null):void => {
    this.swagService.getCart(this.raceID).then((res:any)=>{
      this.raceData.cart = res['cart'];
    }).catch((error:any)=>{
      console.error(error);
      alert("There was an error refreshing your cart. Please reload the page, and if this issue persists please contact Tucan Fitness for help.");
    }).finally(()=>{
      if (callback) callback();
    })
  }

  stepCallback = (callbackStruct:any):void => {
    // if step is completed correctly then do stepper.next()
    let success = callbackStruct.success;
    let type = callbackStruct.type;

    console.log("CALLBACK",callbackStruct);
    if (success) {
      this.stepper.selected.completed = true;
      switch(type) {
        case "PAYMENT":
          this.confirmSignup();
          break;
        default:
          this.raceData.cart = callbackStruct.data as Cart;
          this.finalPrice = this.raceData.cart.price.toString();
          this.stepper.next();
      }
    }

    /*
    if(success) {
      console.log('STEPPER INDEX:',this.stepper.selectedIndex);
      if(type == 'REGISTER') {
        
        this.registerLoginform.controls['complete'].setValue(true);
        console.log('COMPLETE REGISTER',this.registerLoginform);
      }
      if(type == 'PAYMENT') {
        this.paymentForm.controls['complete'].setValue(true);
        let registrationBody = {race_id:this.d.race_id} as any;

        if(this.d.hasTags) {
          let tagFormClean = this.tagForm.value as any;
          registrationBody.tag_id = tagFormClean.tagID
        }
        this._raceService.joinRace(registrationBody);
      }

      if(type == 'TAG') {
        let data = callbackStruct.data;
        this.tagForm.controls['tagID'].setValue(data.id);
      }

      if(type == 'CHECKOUT') {
        // do nothing?
        let cart:Cart = callbackStruct.data;
        this.d.price = cart.price.toString();
        this.cartForm.controls['complete'].setValue(true);
        console.log('IN CHECKOUT RETYURBN:',this.d);
      }

     if(this.stepper.selectedIndex==this.getStepperFinishIndex()) {
      this.closeDialog();
      this.router.navigate(['/welcome']);
     }
     else {
      this.stepper.next();
     }
     
    }
    */
  }

  openTermsOfServicePopup = ():void => {
    this.dialog.open(TermsOfServiceComponent,{
      panelClass:"DialogDefaultContainer"
    });
  }

  confirmSignup = ():void => {
    let registrationBody = {race_id:this.raceID} as any;
    if(this.raceData.hasEntryTags) {
      let tagFormClean = this.tagForm.value as any;
      registrationBody.tag_id = tagFormClean.tagID;
    }
    this.raceService.joinRace(registrationBody)
    /*  
    .then((res:any)=>{
        console.log('JOIN RACE REGISTRATION CALLBACK', res);
        //if (res.success) {
          this.registrationSuccessful = true;
        
        //} else {
        //  throw new Error("Unable to register to the race");
        //}
      }).catch((error:any)=>{
        console.error(error);
        alert("Unable to confirm your race registration. Please try again, and if errors persist contact the TucanFitness team.");
      });
    */
    .finally(()=>{
      this.registrationSuccessful = true;
    })
  }

  navigateToRaceView = ():void => {
    this.routerService.navigateTo("/race",{name:this.raceData.name,id:this.raceID});
  }

}

interface AboutData {
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
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './views/landing/landing.component';
import { ForRaceCreatorsComponent } from './views/for-race-creators/for-race-creators.component';
import { ForRacersComponent } from './views/for-racers/for-racers.component';
import { FaqPageComponent} from './views/faq-page/faq-page.component'
import { PublicRacesComponent } from './views/public-races/public-races.component';
import { RaceAboutComponent } from './views/race-about/race-about.component';
import { AboutTucanComponent} from './views/about-tucan/about-tucan.component'
import {ContactPageComponent} from './views/contact-page/contact-page.component'

import { RaceViewPageComponent } from './race-view-page/race-view-page.component';
import { ProfileComponent } from './views/profile/profile.component';
import { TeamFormComponent } from './team-form/team-form.component';
//import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import {WelcomeComponent} from './welcome/welcome.component'
import { SwagListComponent } from './swag-list/swag-list.component';
import { CartEditComponent } from './cart-edit/cart-edit.component';
import { PaypalComponent } from './paypal/paypal.component';
import { SearchComponent } from './search/search.component';

import { RaceCreateComponent } from './views/race-create/race-create.component';
import { RaceDashboardComponent } from './views/race-dashboard/race-dashboard.component';

import { ItemPortalComponent } from './item-portal/item-portal.component';
import { ConfirmSignupComponent } from './views/confirm-signup/confirm-signup.component';


const routes: Routes = [
  {path:'',component:LandingComponent},
  {path:'for-race-creators',component:ForRaceCreatorsComponent},
  {path:'for-racers',component:ForRacersComponent},
  {path:'faqs', component:FaqPageComponent},
  {path:'races', component:PublicRacesComponent},
  {path:'about',component:RaceAboutComponent},
  {path:'about-tucan', component:AboutTucanComponent},
  {path:'contact', component:ContactPageComponent},

  {path:'confirm-race-signup',component:ConfirmSignupComponent},
  {path:'race', component:RaceViewPageComponent},
  {path:'profile',component:ProfileComponent},
  {path:'teams',component:TeamFormComponent},
  //{path:'shipping', component:ShippingAddressComponent },
  {path:'password-request', component:PasswordRequestComponent},
  {path:'password-change', component:PasswordChangeComponent},
  {path:'welcome', component:WelcomeComponent},
  {path:'search', component:SearchComponent},

  {path:'create', component:RaceCreateComponent},
  {path:'dashboard', component:RaceDashboardComponent},

  {path:'test',component:ItemPortalComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicRacesPageComponent } from './public-races-page/public-races-page.component';
import { RaceViewPageComponent } from './race-view-page/race-view-page.component';
import { LandingPageComponent  } from './landing-page/landing-page.component';
import { RaceCreateComponent } from './race-create/race-create.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RaceAboutPageComponent } from './race-about-page/race-about-page.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RaceDashboardComponent } from './race-dashboard/race-dashboard.component';
import {WelcomeComponent} from './welcome/welcome.component'
import {AboutTucanPageComponent} from './about-tucan-page/about-tucan-page.component'
import {FaqPageComponent} from './faq-page/faq-page.component'
import {ContactPageComponent} from './contact-page/contact-page.component'
import { SwagListComponent } from './swag-list/swag-list.component';
import { CartEditComponent } from './cart-edit/cart-edit.component';
import { PaypalComponent } from './paypal/paypal.component';
import { SearchComponent } from './search/search.component';

import { LandingComponent } from './views/landing/landing.component';
import { ForRaceCreatorsComponent } from './views/for-race-creators/for-race-creators.component';
import { ForRacersComponent } from './views/for-racers/for-racers.component';
import { ItemPortalComponent } from './item-portal/item-portal.component';
import { PublicRacesComponent } from './views/public-races/public-races.component';

const routes: Routes = [
  {path: 'race', component:RaceViewPageComponent},
  {path: 'create', component:RaceCreateComponent},
  {path: 'profile',component:UserPageComponent},
  {path: 'about',component:RaceAboutPageComponent},
  {path: 'teams',component:TeamFormComponent},
  {path: 'shipping', component:ShippingAddressComponent },
  {path: 'password-request', component:PasswordRequestComponent},
  {path: 'password-change', component:PasswordChangeComponent},
  {path: 'dashboard', component:RaceDashboardComponent },
  {path: 'welcome', component:WelcomeComponent},
  {path: 'about-tucan', component:AboutTucanPageComponent},
  {path: 'faqs', component:FaqPageComponent},
  {path: 'contact', component:ContactPageComponent},
  {path: 'search', component:SearchComponent},

  {path:'',component:LandingComponent},
  {path:'for-race-creators',component:ForRaceCreatorsComponent},
  {path:'for-racers',component:ForRacersComponent},
  {path:'test',component:ItemPortalComponent},
  {path: 'races', component:PublicRacesPageComponent},
  //{path: 'races-dev', component:PublicRacesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

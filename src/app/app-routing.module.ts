import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicRacesComponent } from './views/public-races/public-races.component';
import { RaceViewPageComponent } from './race-view-page/race-view-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RaceAboutComponent } from './views/race-about/race-about.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
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

import { RaceCreateComponent } from './views/race-create/race-create.component';
import { RaceDashboardComponent } from './views/race-dashboard/race-dashboard.component';

const routes: Routes = [
  {path: 'race', component:RaceViewPageComponent},
  {path: 'profile',component:UserPageComponent},
  {path: 'about',component:RaceAboutComponent},
  {path: 'teams',component:TeamFormComponent},
  {path: 'shipping', component:ShippingAddressComponent },
  {path: 'password-request', component:PasswordRequestComponent},
  {path: 'password-change', component:PasswordChangeComponent},
  {path: 'welcome', component:WelcomeComponent},
  {path: 'about-tucan', component:AboutTucanPageComponent},
  {path: 'faqs', component:FaqPageComponent},
  {path: 'contact', component:ContactPageComponent},
  {path: 'search', component:SearchComponent},

  {path:'',component:LandingComponent},
  {path:'for-race-creators',component:ForRaceCreatorsComponent},
  {path:'for-racers',component:ForRacersComponent},
  {path:'test',component:ItemPortalComponent},
  {path: 'races', component:PublicRacesComponent},
  //{path: 'races-dev', component:PublicRacesComponent},

  {path: 'create', component:RaceCreateComponent},
  {path: 'dashboard', component:RaceDashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { RaceViewComponent } from './race-view/race-view.component';
import { UsersComponent } from './users/users.component';
import { RaceCreateComponent } from './race-create/race-create.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RaceAboutComponent } from './race-about/race-about.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { RegisterComponent } from './register/register.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { SmilesComponent } from './smiles/smiles.component';
import { LoginComponent } from './login/login.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { RaceDashboardComponent } from './race-dashboard/race-dashboard.component';
import { SwagListComponent } from './swag-list/swag-list.component';
import { CartEditComponent } from './cart-edit/cart-edit.component';
import { PaypalComponent } from './paypal/paypal.component';

const routes: Routes = [
  {path: 'race', component:RaceViewComponent},
  {path: 'races', component:RacesComponent},
  {path: '', component:UsersComponent},
  {path: 'create', component:RaceCreateComponent},
  {path: 'profile',component:UserPageComponent},
  {path: 'about',component:RaceAboutComponent},
  {path: 'teams',component:TeamFormComponent},
  {path: 'register', component:RegisterComponent},
  {path: 'shipping', component:ShippingAddressComponent },
  {path: 'smiles', component:SmilesComponent },
  {path: 'login', component:LoginComponent },
  {path: 'password-request', component:PasswordRequestComponent},
  {path: 'password-change', component:PasswordChangeComponent},
  {path: 'test',component:PaypalComponent},
  {path: 'dashboard', component:RaceDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

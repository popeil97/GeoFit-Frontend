import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { RaceViewComponent } from './race-view/race-view.component';
import { UsersComponent } from './users/users.component';
import { RaceCreateComponent } from './race-create/race-create.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RaceAboutComponent } from './race-about/race-about.component';

const routes: Routes = [
  {path: 'race', component:RaceViewComponent},
  {path: 'races', component:RacesComponent},
  {path: '', component:UsersComponent},
  {path: 'create', component:RaceCreateComponent},
  {path: 'profile',component:UserPageComponent},
  {path:'about',component:RaceAboutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

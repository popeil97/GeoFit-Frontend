import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { RaceViewComponent } from './race-view/race-view.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {path: '', component:RaceViewComponent},
  {path: 'races', component:RacesComponent},
  {path: 'users', component:UsersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

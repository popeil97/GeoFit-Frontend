import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacesComponent } from './races/races.component';
import { RaceViewComponent } from './race-view/race-view.component';
import { UsersComponent } from './users/users.component';
import { RaceCreateComponent } from './race-create/race-create.component';

const routes: Routes = [
  {path: 'race', component:RaceViewComponent},
  {path: 'races', component:RacesComponent},
  {path: '', component:UsersComponent},
  {path: 'create', component:RaceCreateComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

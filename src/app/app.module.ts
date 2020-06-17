import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { RacesComponent } from './races/races.component';
import { UsersComponent } from './users/users.component';
import { RaceComponent } from './race/race.component';
import { MapComponent } from './map/map.component';
import { RaceViewComponent } from './race-view/race-view.component';
import { UserProgressComponent } from './user-progress/user-progress.component';
import { RaceMenuComponent } from './race-menu/race-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { PopUpService } from './pop-up.service';
import { RaceService } from './race.service';
import { RaceCreateComponent } from './race-create/race-create.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RacesComponent,
    UsersComponent,
    RaceComponent,
    MapComponent,
    RaceViewComponent,
    UserProgressComponent,
    RaceMenuComponent,
    RaceCreateComponent,
    LeaderboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    PopUpService,
    RaceService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

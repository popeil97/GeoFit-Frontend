import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { FormsModule } from '@angular/forms';
import {UserService} from './users/users.service';
import {TokenInterceptorService} from './users/tokeninterceptorservice';
import { StravauthService } from './stravauth/stravauth.service';
import { RaceFeedService } from './race-feed/race-feed.service';
import { RaceFeedComponent } from './race-feed/race-feed.component';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { StravauthComponent } from './stravauth/stravauth.component';
import { fromEventPattern } from 'rxjs';
import { LoaderComponent } from './loader/loader.component';
import { ActivitiesMenuComponent } from './activities-menu/activities-menu.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';


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
    StravauthComponent,
    LoaderComponent,
    ActivitiesMenuComponent,
    RaceFeedComponent,
    ManualEntryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    PopUpService,
    RaceService,
    UserService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    StravauthService,
    RaceFeedService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

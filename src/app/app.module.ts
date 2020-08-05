import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
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
import { AuthService} from './auth.service';
import {TokenInterceptorService} from './users/tokeninterceptorservice';
import { StravauthService } from './stravauth/stravauth.service';
import { RaceFeedService } from './feed/race-feed.service';
import { FeedComponent } from './feed/feed.component';
import { StoryService } from './story.service'

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
import { UserPageComponent } from './user-page/user-page.component';
import { RaceAboutComponent } from './race-about/race-about.component';
import { UserFollowComponent } from './user-follow/user-follow.component';
import { StoryBtnComponent } from './story-btn/story-btn.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { UserProfileNavComponent } from './user-profile-nav/user-profile-nav.component';
import { NotificationComponent } from './notification/notification.component';
import { StoryModalComponent } from './story-modal/story-modal.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentsFormComponent } from './comments-form/comments-form.component';
import { RaceSettingsComponent } from './race-settings/race-settings.component';
import { StoryFormComponent } from './story-form/story-form.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PaypalComponent } from './paypal/paypal.component';
import { SignupComponent } from './signup/signup.component';
import { SignupDialogContent } from './signup/signup.component';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { SwagComponent, SwagDialogContent } from './swag/swag.component';

import { createCustomElement } from '@angular/elements';
import { PopupComponent } from './popup/popup.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { ShippingAddressFormComponent } from './shipping-address-form/shipping-address-form.component';
import { SmilesComponent } from './smiles/smiles.component';
import { TermsOfServiceComponent, TermsOfServiceDialogContent } from './terms-of-service/terms-of-service.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';


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
    FeedComponent,
    ManualEntryComponent,
    UserPageComponent,
    RaceAboutComponent,
    UserFollowComponent,
    StoryBtnComponent,
    TeamFormComponent,
    TeamListComponent,
    UserProfileNavComponent,
    NotificationComponent,
    StoryModalComponent,
    CommentsComponent,
    CommentsFormComponent,
    RaceSettingsComponent,
    StoryFormComponent,
    ProfileFormComponent,
    LoginComponent,
    RegisterComponent,
    PaypalComponent,
    SignupComponent,
    SignupDialogContent,
    UserStatsComponent,
    SwagComponent,
    SwagDialogContent,
    PopupComponent,
    ShippingAddressComponent,
    ShippingAddressFormComponent,
    SmilesComponent,
    TermsOfServiceComponent,
    TermsOfServiceDialogContent,
    PasswordRequestComponent,
    PasswordChangeComponent,
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
  exports: [
    PopupComponent,
  ],
  providers: [
    PopUpService,
    RaceService,
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    StravauthService,
    RaceFeedService,
    StoryService,
  ],
  bootstrap: [AppComponent],
  entryComponents:[SignupDialogContent,PopupComponent,SwagDialogContent,TermsOfServiceDialogContent],
})
export class AppModule { 
  constructor(private injector: Injector) {
    //We do this to create Angular components in the HTML domain for 
    //leaflet to bind to pin popups
    const PopupElement = createCustomElement(PopupComponent, {injector});
    // Register the custom element with the browser.
    customElements.define('popup-element', PopupElement);
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { PublicRacesPageComponent } from './public-races-page/public-races-page.component';
import { MapComponent } from './map/map.component';
import { RaceViewPageComponent } from './race-view-page/race-view-page.component';
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
import {TokenInterceptorService} from './landing-page/tokeninterceptorservice';
import { StravauthService } from './stravauth/stravauth.service';
import { RaceFeedService } from './feed/race-feed.service';
import { FeedComponent } from './feed/feed.component';
import { StoryService } from './story.service';
import { ImageService } from './image.service';
import { LeaderboardService } from './leaderboard.service';
import { RegisterComponent } from './register/register.component';
import { RegisterDialogContent } from './register/register.component';

// import { LandingPageComponent  } from './landing-page/landing-page.component';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { StravauthComponent } from './stravauth/stravauth.component';
import { fromEventPattern } from 'rxjs';
import { LoaderComponent } from './loader/loader.component';
import { StravaEntryComponent } from './strava-entry/strava-entry.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RaceAboutPageComponent } from './race-about-page/race-about-page.component';
import { UserFollowComponent } from './user-follow/user-follow.component';
import { StoryBtnComponent } from './story-btn/story-btn.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { UserProfileNavComponent } from './user-profile-nav/user-profile-nav.component';
import { NotificationComponent } from './notification/notification.component';
import { StoryModalComponent } from './story-modal/story-modal.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentsFormComponent } from './comments-form/comments-form.component';
import { StoryFormComponent } from './story-form/story-form.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';

import { PaypalComponent } from './paypal/paypal.component';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { SwagComponent, SwagDialogContent } from './swag/swag.component';


import { createCustomElement } from '@angular/elements';
import { PopupComponent } from './popup/popup.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { ShippingAddressFormComponent } from './shipping-address-form/shipping-address-form.component';

import { TermsOfServiceComponent, TermsOfServiceDialogContent } from './terms-of-service/terms-of-service.component';
import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { StravaInstructionsComponent } from './strava-instructions/strava-instructions.component';
import { ProfilePicFormComponent } from './profile-pic-form/profile-pic-form.component';
import { RoutePinDialogComponent } from './route-pin-dialog/route-pin-dialog.component';

import { OwlModule } from 'ngx-owl-carousel';
import { NotificationPanelComponent } from './notification-panel/notification-panel.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { StoryDialogComponent } from './story-dialog/story-dialog.component';
import { MapService } from './map.service';
import { TagFormComponent } from './tag-form/tag-form.component';
import { TagSelectComponent } from './tag-select/tag-select.component';
import { ReportFormComponent } from './report-form/report-form.component';
import { StoryDeleteDialogComponent } from './story-delete-dialog/story-delete-dialog.component';
import { RaceDashboardComponent } from './race-dashboard/race-dashboard.component';
import { RaceStoryManageComponent } from './race-story-manage/race-story-manage.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { AboutTucanPageComponent } from './about-tucan-page/about-tucan-page.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { WhyInfoComponent,WhyInfoDialogContent} from './why-info/why-info.component';

import { SwagListComponent } from './swag-list/swag-list.component';
import { SwagItemComponent } from './swag-item/swag-item.component';
import { CartEditComponent } from './cart-edit/cart-edit.component';
import { MapRouteComponent } from './map-route/map-route.component';

import { 
  ViewFollowComponent, 
  ///ViewFollowDialogContent 
} from './view-follow/view-follow.component';
import { ShowFollowersComponent } from './show-followers/show-followers.component';
import { ModalComponent } from './modal/modal.component';
import { LoginComponent } from './login/login.component';
import { Register2Component } from './register2/register2.component';

import { RouteSelectComponent } from './route-select/route-select.component';
import { HybridLeaderboardComponent } from './hybrid-leaderboard/hybrid-leaderboard.component';
import { Signup2Component } from './signup2/signup2.component';
import { RaceTypeComponent } from './race-type/race-type.component';
import { UserRaceComponent } from './user-race/user-race.component';
import { LogActivityComponent } from './log-activity/log-activity.component';
import { StoryFormStandaloneComponent } from './story-form-standalone/story-form-standalone.component';
import { MapSettingsComponent } from './map-settings/map-settings.component';
import { SearchComponent } from './search/search.component';
import { RouteInfoComponent } from './route-info/route-info.component';
import { RaceDashboardRacerListComponent } from './race-dashboard-racer-list/race-dashboard-racer-list.component';
import { RaceDashboardRacerRowComponent } from './race-dashboard-racer-row/race-dashboard-racer-row.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { StoryPopupComponent } from './story-popup/story-popup.component';
import { RaceCreatePageComponent } from './race-create-page/race-create-page.component';
import { TeamFormDialogComponent } from './team-form/team-form-dialog.component';
import { LoginDialogComponent } from './login/login-dialog.component';

/* NEW COMPONENTS USING VIEWS/ FOLDER */
import { HeaderNavComponent } from './views/header-nav/header-nav.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { ForRaceCreatorsComponent } from './views/for-race-creators/for-race-creators.component';
import { ForRacersComponent } from './views/for-racers/for-racers.component';
import { FooterComponent } from './views/footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    PublicRacesPageComponent,
    LandingPageComponent,
    MapComponent,
    RaceViewPageComponent,
    UserProgressComponent,
    RaceMenuComponent,
    RaceCreateComponent,
    LeaderboardComponent,
    StravauthComponent,
    LoaderComponent,
    StravaEntryComponent,
    FeedComponent,
    ManualEntryComponent,
    UserPageComponent,
    RaceAboutPageComponent,
    UserFollowComponent,
    StoryBtnComponent,
    TeamFormComponent,
    TeamListComponent,
    UserProfileNavComponent,
    NotificationComponent,
    StoryModalComponent,
    CommentsComponent,
    CommentsFormComponent,
    StoryFormComponent,
    ProfileFormComponent,
    PaypalComponent,
    UserStatsComponent,
    SwagComponent,
    SwagDialogContent,
    PopupComponent,
    ShippingAddressComponent,
    ShippingAddressFormComponent,
    TermsOfServiceComponent,
    TermsOfServiceDialogContent,
    PasswordRequestComponent,
    PasswordChangeComponent,
    StravaInstructionsComponent,
    ProfilePicFormComponent,
    RoutePinDialogComponent,
    NotificationPanelComponent,
    SnackbarComponent,
    StoryDialogComponent,
    TagFormComponent,
    TagSelectComponent,
    ReportFormComponent,
    StoryDeleteDialogComponent,
    RaceDashboardComponent,
    RaceStoryManageComponent,
    WelcomeComponent,
    AboutTucanPageComponent,
    FaqPageComponent,
    ContactPageComponent,
    WhyInfoComponent,
    WhyInfoDialogContent,
    SwagListComponent,
    SwagItemComponent,
    CartEditComponent,
    MapRouteComponent,
    ViewFollowComponent,
    //ViewFollowDialogContent,
    ShowFollowersComponent,
    ModalComponent,
    LoginComponent,
    Register2Component,
    RouteSelectComponent,
    HybridLeaderboardComponent,
    Signup2Component,
    RaceTypeComponent,
    UserRaceComponent,
    LogActivityComponent,
    StoryFormStandaloneComponent,
    MapSettingsComponent,
    SearchComponent,
    RouteInfoComponent,
    RaceDashboardRacerListComponent,
    RaceDashboardRacerRowComponent,
    ActivityListComponent,
    RegisterComponent,
    RegisterDialogContent,
    ContactFormComponent,
    StoryPopupComponent,
    RaceCreatePageComponent,
    TeamFormDialogComponent,

    HeaderNavComponent,
    ForRaceCreatorsComponent,
    LoginDialogComponent,
    ForRacersComponent,
    FooterComponent,
      ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    OwlModule,
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
    ImageService,
    LeaderboardService,
    MapService,
  ],
  bootstrap: [AppComponent],
  entryComponents:[
                  PopupComponent,
                  SwagDialogContent,
                  TermsOfServiceDialogContent,
                  RoutePinDialogComponent,
                  NotificationPanelComponent,
                  SnackbarComponent, 
                  StoryDialogComponent,
                  ReportFormComponent,
                  StoryDeleteDialogComponent,
                  WhyInfoDialogContent,
                  TeamFormDialogComponent,
                  //ViewFollowDialogContent

                  LoginComponent,
                  Register2Component,
                  Signup2Component,
                  LogActivityComponent,
                  ] 
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

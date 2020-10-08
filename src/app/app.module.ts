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
import { StoryService } from './story.service';
import { ImageService } from './image.service';
import { LeaderboardService } from './leaderboard.service';

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
import { LoginComponent, LoginDialogContent } from './login/login.component';
import { RegisterComponent, RegisterDialogContent} from './register/register.component';
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
import { RaceDayComponent, RaceDayDialogContent} from './race-day/race-day.component';
import { StravaInstructionsComponent } from './strava-instructions/strava-instructions.component';
import { ManualInstructionsComponent} from './manual-instructions/manual-instructions.component';
import { ProfilePicComponent } from './profile-pic/profile-pic.component';
import { FaqHelpComponent,FaqHelpDialogContent } from './faq-help/faq-help.component';
import { ContactHelpComponent,ContactHelpDialogContent } from './contact-help/contact-help.component';
import { TeamInstructionsComponent } from './team-instructions/team-instructions.component';
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
import { AboutTucanComponent } from './about-tucan/about-tucan.component';
import { FaqPageComponent } from './faq-page/faq-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { DialogSkeletonComponent,DialogSkeletonDialogContent } from './dialog-skeleton/dialog-skeleton.component';
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
import { Login2Component } from './login2/login2.component';
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
    LoginDialogContent,
    RegisterComponent,
    RegisterDialogContent,
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
    RaceDayComponent,
    RaceDayDialogContent,
    StravaInstructionsComponent,
    ManualInstructionsComponent,
    ProfilePicComponent,
    FaqHelpComponent,
    FaqHelpDialogContent,
    ContactHelpComponent,
    ContactHelpDialogContent,
    TeamInstructionsComponent,
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
    AboutTucanComponent,
    FaqPageComponent,
    ContactPageComponent,
    DialogSkeletonComponent,
    DialogSkeletonDialogContent,
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
    Login2Component,
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
  entryComponents:[SignupDialogContent,
                  PopupComponent,
                  SwagDialogContent,
                  TermsOfServiceDialogContent,
                  RaceDayDialogContent, 
                  FaqHelpDialogContent,ContactHelpDialogContent,
                  RoutePinDialogComponent,
                  NotificationPanelComponent,
                  SnackbarComponent, 
                  StoryDialogComponent,
                  ReportFormComponent,
                  StoryDeleteDialogComponent,
                  LoginDialogContent,
                  RegisterDialogContent,
                  DialogSkeletonDialogContent,
                  WhyInfoDialogContent,
                  //ViewFollowDialogContent
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

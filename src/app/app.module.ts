import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicRacesComponent } from './views/public-races/public-races.component';
import { MapComponent } from './map/map.component';
import { RaceViewPageComponent } from './race-view-page/race-view-page.component';
import { UserProgressComponent } from './user-progress/user-progress.component';
import { RaceMenuComponent } from './race-menu/race-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { FormsModule } from '@angular/forms';
import { 
  AuthService, 
  RaceService,
  UserProfileService, 
  MapService,
  ImageService,
  ItemService,
  StoryService,
  PopUpService,
  LeaderboardService,
  TokenInterceptorService,
  RaceFeedService,
} from './services/';
import { StravauthService } from './stravauth/stravauth.service';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';

import { StravauthComponent } from './stravauth/stravauth.component';
import { LoaderComponent } from './loader/loader.component';
import { StravaEntryComponent } from './strava-entry/strava-entry.component';
import { ManualEntryComponent } from './manual-entry/manual-entry.component';
import { ProfileComponent } from './views/profile/profile.component';
import { RaceAboutComponent } from './views/race-about/race-about.component';
import { UserFollowComponent } from './user-follow/user-follow.component';
import { StoryBtnComponent } from './story-btn/story-btn.component';
import { TeamFormComponent } from './team-form/team-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { UserProfileNavComponent } from './user-profile-nav/user-profile-nav.component';
import { NotificationComponent } from './notification/notification.component';
import { StoryModalComponent } from './story-modal/story-modal.component';
import { CommentsComponent } from './comments/comments.component';
import { CommentsFormComponent } from './comments-form/comments-form.component';
import {
  StoryFormComponent, 
  FeedComponent,
} from './components';

import { PaypalComponent } from './paypal/paypal.component';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { SwagComponent, SwagDialogContent } from './swag/swag.component';

import { createCustomElement } from '@angular/elements';
import { PopupComponent } from './popup/popup.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';
import { ShippingAddressFormComponent } from './shipping-address-form/shipping-address-form.component';

import { PasswordRequestComponent } from './password-request/password-request.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { StravaInstructionsComponent } from './strava-instructions/strava-instructions.component';
import { ProfilePicFormComponent } from './welcome/profile-pic-form/profile-pic-form.component';
import { RoutePinDialogComponent } from './route-pin-dialog/route-pin-dialog.component';

import { OwlModule } from 'ngx-owl-carousel';
import { NotificationPanelComponent } from './notification-panel/notification-panel.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
//import { StoryDialogComponent } from './story-dialog/story-dialog.component';
import { TagFormComponent } from './tag-form/tag-form.component';
import { TagSelectComponent } from './tag-select/tag-select.component';
import { RaceStoryManageComponent } from './race-story-manage/race-story-manage.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { AboutTucanComponent } from './views/about-tucan/about-tucan.component';
import { FaqPageComponent } from './views/faq-page/faq-page.component';
import { ContactPageComponent } from './views/contact-page/contact-page.component';

import { SwagListComponent } from './swag-list/swag-list.component';
import { SwagItemComponent } from './swag-item/swag-item.component';
import { CartEditComponent } from './cart-edit/cart-edit.component';
import { MapRouteComponent } from './map-route/map-route.component';

import { ShowFollowersComponent } from './show-followers/show-followers.component';
import { ModalComponent } from './modal/modal.component';
import { 
  LoginComponent,
  RegisterComponent,
  SignupComponent, 
  RaceTypeComponent,
  ProfileFormComponent,
  ViewFollowComponent,
  RaceMerchandiseSettingsItemComponent,
  RouteInfoComponent,
  TermsOfServiceComponent,
  WhyBirthdayComponent,
  ReportFormComponent,
  StoryDeleteFormComponent,
  ConfirmationPopupComponent,
  StoryPopupComponent,
} from './popups';

import { RouteSelectComponent } from './route-select/route-select.component';
import { HybridLeaderboardComponent } from './hybrid-leaderboard/hybrid-leaderboard.component';
import { UserRaceComponent } from './user-race/user-race.component';
import { LogActivityComponent } from './log-activity/log-activity.component';
import { SearchComponent } from './search/search.component';
import { RaceDashboardRacerListComponent } from './race-dashboard-racer-list/race-dashboard-racer-list.component';
import { RaceDashboardRacerRowComponent } from './race-dashboard-racer-row/race-dashboard-racer-row.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { TeamFormDialogComponent } from './team-form/team-form-dialog.component';
import { CheckpointListComponent } from './checkpoint-list/checkpoint-list.component';
import { CheckpointItemComponent } from './checkpoint-item/checkpoint-item.component';
import { CheckpointDialogComponent } from './checkpoint-list/checkpoint-dialog.component';
import { ForRaceCreatorsComponent } from './views/for-race-creators/for-race-creators.component';
import { FooterComponent } from './views/footer/footer.component';
import { ForRacersComponent } from './views/for-racers/for-racers.component';
import { LandingComponent } from './views/landing/landing.component';
import { HeaderNavComponent } from './views/header-nav/header-nav.component';
import { ItemPortalComponent } from './item-portal/item-portal.component';
import { ItemListComponent } from './item-portal/item-list.component';
import { ItemFormComponent } from './item-portal/item-form.component';
import { ItemFormDialogComponent } from './item-portal/item-form-dialog.component';
import { RaceCreateComponent } from './views/race-create/race-create.component';
import { RaceDashboardComponent } from './views/race-dashboard/race-dashboard.component';
import { RaceSettingsComponent } from './views/race-dashboard/race-settings/race-settings.component';
import { RaceBasicsComponent } from './views/race-dashboard/race-basics/race-basics.component';
import { RaceMapSettingsComponent } from './views/race-dashboard/race-map-settings/race-map-settings.component';
import { RaceMerchandiseSettingsComponent } from './views/race-dashboard/race-merchandise-settings/race-merchandise-settings.component';


@NgModule({
  declarations: [
    AppComponent,
    PublicRacesComponent,
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
    ProfileComponent,
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
    PasswordRequestComponent,
    PasswordChangeComponent,
    StravaInstructionsComponent,
    ProfilePicFormComponent,
    RoutePinDialogComponent,
    NotificationPanelComponent,
    SnackbarComponent,
    //StoryDialogComponent,
    TagFormComponent,
    TagSelectComponent,
    ReportFormComponent,
    StoryDeleteFormComponent,
    RaceDashboardComponent,
    RaceStoryManageComponent,
    WelcomeComponent,
    AboutTucanComponent,
    FaqPageComponent,
    ContactPageComponent,
    WhyBirthdayComponent,
    SwagListComponent,
    SwagItemComponent,
    CartEditComponent,
    MapRouteComponent,
    ViewFollowComponent,
    ShowFollowersComponent,
    ModalComponent,
    LoginComponent,
    RegisterComponent,
    RouteSelectComponent,
    HybridLeaderboardComponent,
    SignupComponent,
    RaceTypeComponent,
    UserRaceComponent,
    LogActivityComponent,
    SearchComponent,
    RouteInfoComponent,
    RaceDashboardRacerListComponent,
    RaceDashboardRacerRowComponent,
    ActivityListComponent,
    ContactFormComponent,
    StoryPopupComponent,
    TeamFormDialogComponent,
    CheckpointListComponent,
    CheckpointItemComponent,
    CheckpointDialogComponent,
    ForRaceCreatorsComponent,
    FooterComponent,
    ForRacersComponent,
    LandingComponent,
    HeaderNavComponent,
    ItemPortalComponent,
    ItemListComponent,
    ItemFormComponent,
    ItemFormDialogComponent,
    RaceSettingsComponent,
    RaceBasicsComponent,
    RaceMapSettingsComponent,
    RaceMerchandiseSettingsComponent,
    RaceMerchandiseSettingsItemComponent,
    ConfirmationPopupComponent,
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
  bootstrap: [
    AppComponent
  ],
  entryComponents:[
    PopupComponent,
    SwagDialogContent,
    RoutePinDialogComponent,
    NotificationPanelComponent,
    SnackbarComponent, 
    //StoryDialogComponent,
    ReportFormComponent,
    StoryDeleteFormComponent,
    TeamFormDialogComponent,
    CheckpointDialogComponent,
    LoginComponent,
    RegisterComponent,
    SignupComponent,
    LogActivityComponent,
    ItemFormDialogComponent,
    RaceMerchandiseSettingsItemComponent,
    ProfileFormComponent,
    ViewFollowComponent,
    RaceTypeComponent,
    RouteInfoComponent,
    TermsOfServiceComponent,
    WhyBirthdayComponent,
    ConfirmationPopupComponent,
    StoryPopupComponent,
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

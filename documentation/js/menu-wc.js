'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">geo-fit documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' : 'data-target="#xs-components-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' :
                                            'id="xs-components-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' }>
                                            <li class="link">
                                                <a href="components/ActivitiesMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActivitiesMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CommentsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CommentsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CommentsFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CommentsFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactHelpComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactHelpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ContactHelpDialogContent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContactHelpDialogContent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FaqHelpComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FaqHelpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FaqHelpDialogContent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FaqHelpDialogContent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FeedComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FeedComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LeaderboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LeaderboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoaderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManualEntryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManualEntryComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManualInstructionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManualInstructionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MapComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MapComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NotificationPanelComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationPanelComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordChangeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordChangeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PasswordRequestComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PasswordRequestComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PaypalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PaypalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PopupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PopupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfilePicComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfilePicComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceAboutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceAboutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceCreateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceCreateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceDashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceDashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceDayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceDayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceDayDialogContent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceDayDialogContent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceMenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceSettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceSettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceStoryManageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceStoryManageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RaceViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RaceViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RacesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RacesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegisterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegisterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RoutePinDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RoutePinDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShippingAddressComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShippingAddressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ShippingAddressFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ShippingAddressFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignupComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupDialogContent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignupDialogContent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SmilesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SmilesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnackbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SnackbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StoryBtnComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryBtnComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StoryDeleteDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryDeleteDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StoryDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StoryFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StoryModalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StoryModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StravaInstructionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StravaInstructionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StravauthComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">StravauthComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SwagComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SwagComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SwagDialogContent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SwagDialogContent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TagFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TagFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TagSelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TagSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamFormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamFormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamInstructionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamInstructionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TeamListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TeamListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsOfServiceComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TermsOfServiceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TermsOfServiceDialogContent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TermsOfServiceDialogContent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserFollowComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserFollowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserProfileNavComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserProfileNavComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserProgressComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserProgressComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserStatsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserStatsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' : 'data-target="#xs-injectables-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' :
                                        'id="xs-injectables-links-module-AppModule-6b7b039c76d245f5cedce99b22bc38d2"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ImageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ImageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LeaderboardService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LeaderboardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MapService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MapService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PopUpService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PopUpService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RaceFeedService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RaceFeedService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RaceService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RaceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StoryService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StoryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StravauthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StravauthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ActivitiesService.html" data-type="entity-link">ActivitiesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CoordinatesService.html" data-type="entity-link">CoordinatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link">ImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LeaderboardService.html" data-type="entity-link">LeaderboardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MapService.html" data-type="entity-link">MapService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link">NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderService.html" data-type="entity-link">OrderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaymentsService.html" data-type="entity-link">PaymentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PopUpService.html" data-type="entity-link">PopUpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RaceFeedService.html" data-type="entity-link">RaceFeedService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RaceService.html" data-type="entity-link">RaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReportService.html" data-type="entity-link">ReportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StoryService.html" data-type="entity-link">StoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StravauthService.html" data-type="entity-link">StravauthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SwagService.html" data-type="entity-link">SwagService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagsService.html" data-type="entity-link">TagsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeamService.html" data-type="entity-link">TeamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserProfileService.html" data-type="entity-link">UserProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link">UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/USPSShippingService.html" data-type="entity-link">USPSShippingService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/TokenInterceptorService.html" data-type="entity-link">TokenInterceptorService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AboutData.html" data-type="entity-link">AboutData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Activity.html" data-type="entity-link">Activity</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Address.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Address-1.html" data-type="entity-link">Address</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Comment.html" data-type="entity-link">Comment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Comment-1.html" data-type="entity-link">Comment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Comment-2.html" data-type="entity-link">Comment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CommentForm.html" data-type="entity-link">CommentForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Event.html" data-type="entity-link">Event</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedObj.html" data-type="entity-link">FeedObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedObj-1.html" data-type="entity-link">FeedObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedObj-2.html" data-type="entity-link">FeedObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedObj-3.html" data-type="entity-link">FeedObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedObj-4.html" data-type="entity-link">FeedObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeedPayload.html" data-type="entity-link">FeedPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FollowersResp.html" data-type="entity-link">FollowersResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FromResp.html" data-type="entity-link">FromResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GraphHopperResp.html" data-type="entity-link">GraphHopperResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardItem.html" data-type="entity-link">LeaderboardItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LeaderboardStruct.html" data-type="entity-link">LeaderboardStruct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapBoxCoord.html" data-type="entity-link">MapBoxCoord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapBoxPlace.html" data-type="entity-link">MapBoxPlace</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapBoxPlaceResp.html" data-type="entity-link">MapBoxPlaceResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MapData.html" data-type="entity-link">MapData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationResp.html" data-type="entity-link">NotificationResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Order.html" data-type="entity-link">Order</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OrgPinData.html" data-type="entity-link">OrgPinData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Payment.html" data-type="entity-link">Payment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PinSettings.html" data-type="entity-link">PinSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PinSettings-1.html" data-type="entity-link">PinSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PinSettings-2.html" data-type="entity-link">PinSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfileForm.html" data-type="entity-link">ProfileForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProfileForm-1.html" data-type="entity-link">ProfileForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Progress.html" data-type="entity-link">Progress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RaceData.html" data-type="entity-link">RaceData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RaceData-1.html" data-type="entity-link">RaceData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RaceForm.html" data-type="entity-link">RaceForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RaceSettings.html" data-type="entity-link">RaceSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RoutePins.html" data-type="entity-link">RoutePins</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignupCallbackStruct.html" data-type="entity-link">SignupCallbackStruct</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SignupDialogData.html" data-type="entity-link">SignupDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Story.html" data-type="entity-link">Story</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StravaData.html" data-type="entity-link">StravaData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SwagDialogData.html" data-type="entity-link">SwagDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SwagForm.html" data-type="entity-link">SwagForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SwagStepCallbackData.html" data-type="entity-link">SwagStepCallbackData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tag.html" data-type="entity-link">Tag</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TagFormObj.html" data-type="entity-link">TagFormObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamEditBody.html" data-type="entity-link">TeamEditBody</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamForm.html" data-type="entity-link">TeamForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeamFormResp.html" data-type="entity-link">TeamFormResp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-1.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-2.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-3.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-4.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-5.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-6.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-7.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserData-8.html" data-type="entity-link">UserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserSettings.html" data-type="entity-link">UserSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserStats.html" data-type="entity-link">UserStats</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
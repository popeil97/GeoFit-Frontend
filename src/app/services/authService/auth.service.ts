import {Injectable, EventEmitter, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { UserProfileService } from "../userProfileService/userprofile.service";
import {
  UserData
} from '../../interfaces';
import { Observable, Observer, Subject, } from 'rxjs';

@Injectable()
export class AuthService {

  // http options used for making API calls
  private httpOptions: any;

  public getLoginStatus:Subject<Boolean> = new Subject<Boolean>();

  public userData:UserData = null;
  public userDataChange:Subject<UserData> = new Subject<UserData>();
 
  // the actual JWT token
  public token: string;
 
  // the token expiration date
  public token_expires: Date;
 
  // the username of the logged in user
  public username: string;
 
  // error messages received from the login attempt
  public errors: any = [];
 
  constructor(
    private http: HttpClient,
    private _userProfileService:UserProfileService,
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.userDataChange.subscribe(val=>{
      this.userData = val;
    })
    if (this.isLoggedIn()) {
      this.username = localStorage.getItem('loggedInUsername');
      this._userProfileService.requestUserProfile(this.username).then(d=>{
        this.userDataChange.next(d as UserData);
      }).catch(error=>{
        console.error(error);
      })
    }
  }
 
  // Uses http.post() to register user from REST API endpoint
  public register(registerForm) {
//    console.log(registerForm);
    return this.http.post(environment.apiUrl + '/accounts/register/', registerForm, this.httpOptions).toPromise();
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
    return this.http.post(environment.apiUrl + '/accounts/login/', JSON.stringify(user), this.httpOptions).toPromise();
  }

  public isLoggedIn():Boolean {
    if(localStorage.getItem('loggedInUsername') && localStorage.getItem('access_token')) {
      return true;
    }
    return false;
  }
 
  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
  //  console.log(JSON.stringify({token: this.token}));
    this.http.post(environment.apiUrl + '/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  public logout() {
    //Remove JWT in local storage

    this.http.post(environment.apiUrl + '/accounts/logout/', JSON.stringify({}), this.httpOptions).subscribe(
      err => {
        this.errors = err['error'];
      }
    );

    //Only remove access token after logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('loggedInUsername');

    this.token = null;
    this.token_expires = null;
    this.username = null;

    this.emitLoginStausChange();
    this.updateUserData(null);
  }
 
  private updateData(token) {
    this.token = token;
  //  console.log("Set token to ", this.token);
    this.errors = [];
 
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }

  public requestPassword(email: string){
    return this.http.post(environment.apiUrl + '/accounts/password-request/', JSON.stringify({'email': email}), this.httpOptions);
  }

  public changePassword(password: string, slug: string){
    return this.http.post(environment.apiUrl + '/accounts/password-change/', JSON.stringify({'password': password, 'slug': slug}), this.httpOptions);
  }

  emitLoginStausChange() {
    this.getLoginStatus.next(this.isLoggedIn());
  }

  updateUserData(d:UserData) {
    this.userDataChange.next(d);
  }
 
}
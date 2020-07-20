import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class StravauthService {
 
  // http options used for making API calls
  private httpOptions: any;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
 
  // Uses http.post() to register user from REST API endpoint
  public authenticate() {
    //window.location.href='https://app.strava.com/oauth/authorize?client_id=49168&redirect_uri=http://localhost:8000/strava-login/&response_type=code&approval_prompt=auto&scope=write/';
    this.http.get(environment.apiUrl + '/api/strava-login/').subscribe(
      data => {
        if (data.hasOwnProperty('url')){
            window.location.href=data['url'];
        } 
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  public getStravaInfo() {
    return this.http.post(environment.apiUrl + '/api/strava-status/', {}).toPromise();
  }

  public deauthorize() {
    return this.http.post(environment.apiUrl + '/api/strava-deauth/', {}).toPromise();
  }
}
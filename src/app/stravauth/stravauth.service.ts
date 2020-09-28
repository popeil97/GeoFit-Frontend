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
      headers: new HttpHeaders({'Content-Type': 'application/json',
                                  'Access-Control-Allow-Origin': '*',
                                  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'})
    };

  }
 
  public authenticate() {
    //window.location.href='https://app.strava.com/oauth/authorize?client_id=49168&redirect_uri=http://localhost:8000/strava-login/&response_type=code&approval_prompt=auto&scope=write/';
    this.http.get(environment.apiUrl + '/api/strava-login/').subscribe(
      data => {
       //  console.log(data['url']);
       //  console.log("Going to this url....");
        if (data.hasOwnProperty('url')){
            window.location.href=data['url'];
        } 
      },
      err => {
    //     console.log(err);
        this.errors = err['error'];
      }
    );
  //   console.log("called authenticate()");
  }

  public getStravaInfo() {
    return this.http.post(environment.apiUrl + '/api/strava-status/', {}).toPromise();
  }

  public deauthorize() {
    return this.http.post(environment.apiUrl + '/api/strava-deauth/', {}).toPromise();
  }
}
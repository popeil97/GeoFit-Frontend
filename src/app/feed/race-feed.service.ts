import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable()
export class RaceFeedService {

  // http options used for making API calls
  private httpOptions: any;

  // error messages received from the login attempt
  public errors: any = [];

  // time since last refresh of feed
  public refresh_ts: any;

  // ID of race this service queries
  public ID: number;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.refresh_ts = null;
  }

  public refreshFeed() {
    //Comment this out as we continue to explore ways to refresh feed
    //this.refresh_ts = Math.round((new Date()).getTime() / 1000);
    return this.http.post(environment.apiUrl + '/api/refresh-feed/', {refresh : this.refresh_ts, race_id: this.ID}).toPromise();
  }

  public resetFeed(){
    this.refresh_ts = null;
  }
}

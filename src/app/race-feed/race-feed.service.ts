import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
 
@Injectable()
export class RaceFeedService {
 
  // http options used for making API calls
  private httpOptions: any;

  // error messages received from the login attempt
  public errors: any = [];

  // time since last refresh of feed
  public refresh_ts: any;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.refresh_ts = null;
  }
 
  // Uses http.post() to register user from REST API endpoint
  public refreshFeed() {
    var ret = this.http.post('api/refresh-feed/', {refresh : this.refresh_ts, race_id: 1}).toPromise();

    //Update the refesh timestamp
    this.refresh_ts = Math.round((new Date()).getTime() / 1000);
    console.log("refresh ts: ", this.refresh_ts)
    return ret;
  }
}
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

  // ID of race this service queries
  public raceID: number;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };

    this.refresh_ts = null;
  }
 
  public refreshFeed() {
    console.log("RACEID IN SERVICE: ", this.raceID);
    var ret = this.http.post('api/refresh-feed/', {refresh : this.refresh_ts, race_id: this.raceID}).toPromise();

    //Update the refesh timestamp
    this.refresh_ts = Math.round((new Date()).getTime() / 1000);

    return ret;
  }
}
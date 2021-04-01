import {Injectable} from '@angular/core';
import { Subject } from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

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

  public FeedUpdateSubscription:Subject<any> = new Subject<any>();


  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    this.refresh_ts = null;
  }

  public refreshFeed(page_num: number, items_per_page: number, init: boolean = false) {
    //return this.http.post(environment.apiUrl + '/race-stat/feed/refresh/', {refresh : this.refresh_ts, race_id: this.ID}).toPromise();
    return this.http.post(environment.apiUrl + '/race-stat/feed/paginate/', {page_number : page_num, items_per_page: items_per_page, init: init, race_id: this.ID}).toPromise();
  }

  public resetFeed(){
    this.refresh_ts = null;
  }

  public feedUpdated = () => {
    this.FeedUpdateSubscription.next();
  }

  

}

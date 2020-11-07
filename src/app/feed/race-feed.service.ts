import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { ModalService } from '../modalServices';

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

  public refreshFeed(page_num: number, items_per_page: number, init: boolean = false) {
    //return this.http.post(environment.apiUrl + '/race-stat/feed/refresh/', {refresh : this.refresh_ts, race_id: this.ID}).toPromise();
    return this.http.post(environment.apiUrl + '/race-stat/feed/paginate/', {page_number : page_num, items_per_page: items_per_page, init: init, race_id: this.ID}).toPromise();
  }

  public resetFeed(){
    this.refresh_ts = null;
  }


  

}

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
 
@Injectable()
export class RaceFeedService {
 
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
  public refreshFeed(refresh) {
    return this.http.post('api/refresh-feed/', {refresh : refresh, race_id: 1}).toPromise();
  }
}
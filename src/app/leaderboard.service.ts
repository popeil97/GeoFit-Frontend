import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable()
export class LeaderboardService {

  // http options used for making API calls
  private httpOptions: any;

  // error messages received from the login attempt
  public errors: any = [];

  // ID of race this service queries
  public raceID: number;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public getIndividualLeaderboard() {
    return this.http.post(environment.apiUrl + '/api/individual-leaderboard/', {race_id : this.raceID}).toPromise();
  }

  public getTeamLeaderboard() {
    return this.http.post(environment.apiUrl + '/api/team-leaderboard/', {race_id : this.raceID}).toPromise();
  }

}

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

  public getIndividualLeaderboard(page:number,tagID?:number) {

    let payload = {race_id:this.raceID,page:page} as any;

    if(tagID) {
      payload.tag_id = tagID;
    }

    return this.http.post(environment.apiUrl + '/api/individual-leaderboard/', payload).toPromise();
  }

  public getTeamLeaderboard(page:number,tagID?:number) {

    let payload = {race_id:this.raceID,page:page} as any;

    if(tagID) {
      payload.tag_id = tagID;
    }

    return this.http.post(environment.apiUrl + '/api/team-leaderboard/', payload).toPromise();
  }

  public getOrganizationLeaderboard() {
    return this.http.post(environment.apiUrl + '/api/organization-leaderboard/',{race_id:this.raceID}).toPromise();
  }

}

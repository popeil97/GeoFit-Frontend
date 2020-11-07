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

    return this.http.post(environment.apiUrl + '/race/individual-leaderboard/', payload).toPromise();
  }

  public getTeamLeaderboard(page:number,tagID?:number) {

    let payload = {race_id:this.raceID,page:page} as any;

    if(tagID) {
      payload.tag_id = tagID;
    }

    return this.http.post(environment.apiUrl + '/race/team-leaderboard/', payload).toPromise();
  }

  public getOrganizationLeaderboard() {
    return this.http.post(environment.apiUrl + '/race/org-leaderboard/',{race_id:this.raceID}).toPromise();
  }

  public getHybridLeaderboard(race_id:number,page:number) {
    return this.http.post(environment.apiUrl + '/race/hybrid-leaderboard/',{race_id:race_id,page:page}).toPromise();
  }

}

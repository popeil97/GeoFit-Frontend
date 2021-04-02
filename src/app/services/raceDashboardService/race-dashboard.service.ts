import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RaceDashboardService {

  // used to communicate with race-view-page component

  // http options used for making API calls
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }

  getRacerList(race_id:number) {
    console.log("Getting racer list with ID ", race_id);
    return this.http.post(environment.apiUrl + '/race-stat/dashboard/racer-list/',{race_id:race_id}).toPromise();
  }

  removeUserFromRaceByID(race_id: number, user_id: number){
    return this.http.post(environment.apiUrl + '/race-stat/dashboard/remove-user/',{race_id:race_id, user_id: user_id}).toPromise();
  }

}
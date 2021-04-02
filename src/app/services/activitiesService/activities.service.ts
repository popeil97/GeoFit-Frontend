import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  constructor(private http:HttpClient) { }

  importActivities(act_ids:number[], race_id:number) {
    let body = {
      acts:act_ids,
      race_id:race_id
    };

    return this.http.post(environment.apiUrl + '/race/import/',body).toPromise();
  } 

  uploadManualEntry(entry:any, race_id:number) {
    let body = {
      race_id: race_id,
      manualEntry: entry
    };

    return this.http.post(environment.apiUrl + '/race/manual/',body).toPromise();
  }

  getActivities(race_id:number) {
    return this.http.post(environment.apiUrl + '/race/eligible-activities/',{race_id:race_id}).toPromise();
  }

  removeAppliedActivity(activity_id: number){
    return this.http.post(environment.apiUrl + '/race-stat/applied-activity/remove/', {activity_id: activity_id}).toPromise();
  }
}
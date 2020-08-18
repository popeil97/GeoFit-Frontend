import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';

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

    return this.http.post(environment.apiUrl + '/api/import/',body).toPromise();
  } 

  uploadManualEntry(entry:any, race_id:number) {
    let body = {
      race_id: race_id,
      manualEntry: entry
    };

    return this.http.post(environment.apiUrl + '/api/manual/',body).toPromise();
  }

  getActivities(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-activities/',{race_id:race_id}).toPromise();
  }
}

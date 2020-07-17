import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

    return this.http.post('/api/import/',body).toPromise();
  } 

  uploadManualEntry(entry:any, race_id:number) {
    let body = {
      race_id: race_id,
      manualEntry: entry
    };

    return this.http.post('/api/manual/',body).toPromise();
  }
}

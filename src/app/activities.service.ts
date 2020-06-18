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

    return this.http.post('http://localhost:8000/api/import',body).toPromise();
  } 
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CheckpointService {

  constructor(private http:HttpClient) { }

  getCheckpointMapData(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/map-checkpoints/',{race_id:race_id}).toPromise();
  }

  getCheckpointContentByID(checkpointID:number) {
    return this.http.post(environment.apiUrl + '/api/get-checkpoint/',{checkpoint_id:checkpointID}).toPromise();
  }
}

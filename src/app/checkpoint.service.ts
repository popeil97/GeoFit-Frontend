import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CheckpointService {

  constructor(private http:HttpClient) { }

  getCheckpointContentByID(checkpointID:number) {
    return this.http.post(environment.apiUrl + '/api/get-checkpoint/',{checkpoint_id:checkpointID}).toPromise();
  }
}

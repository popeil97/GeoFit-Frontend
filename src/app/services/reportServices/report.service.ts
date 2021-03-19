import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private httpOptions:any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  closeCase(race_id: number, story_id:number) {
    //Close all reports involving Story with ID story_id
    return this.http.post(environment.apiUrl + '/report/close/',{race_id: race_id, story_id:story_id}).toPromise();
  }
}

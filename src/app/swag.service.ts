import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SwagService {

  private httpOptions:any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  getSwagForm(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/swagform-get/',{race_id:race_id}).toPromise();
  }

  updateSwagForm(race_id:number,form:any) {
    return this.http.post(environment.apiUrl + '/api/swagform-update/',{race_id:race_id,form:form}).toPromise();
  }
}

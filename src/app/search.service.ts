import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private httpOptions:any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  searchForRacer(query:string,raceID:number) {
    console.log('ATTEMPTING TO FILTER!!!',query);
    return this.http.get(environment.apiUrl + '/api/racer-search/',{params:{query:query,race_id:raceID.toString()}}).toPromise();
  }
}

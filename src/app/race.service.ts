import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  // used to communicate with race-view component

  // http options used for making API calls
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }


  getRaces(user:any) {
    return this.http.get('http://localhost:8000/races/')
  }

  getRace(race_id:number) {
    console.log(race_id)
    return this.http.post('http://localhost:8000/api/race/',{race_id:race_id});
  }

  joinRace(race_id:number) {
    console.log('service API attempt:',race_id);
    return this.http.post('http://localhost:8000/api/join/',{race_id:race_id}).toPromise();
  }


}

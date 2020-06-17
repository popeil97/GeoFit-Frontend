import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  // used to communicate with race-view component

  // http options used for making API calls
  private httpOptions: any;

  private selectedRaceID:number; 

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }


  getRaces(user:any) {
    //return [
    //  {name: 'Race1', distance:37.4, distance_type: 'Mi', start_date: '06/11/2020', end_date: '07/11/2020', id:1, start_loc:'Ocala, FL', end_loc:'Gainesville, FL'},
     // {name: 'Race2', distance:37.4, distance_type: 'Mi', start_date: '06/11/2020', end_date: '07/11/2020', id:2, start_loc:'Ocala, FL', end_loc:'Gainesville, FL'},
    //  {name: 'Race3', distance:37.4, distance_type: 'Mi', start_date: '06/11/2020', end_date: '07/11/2020', id:3, start_loc:'Ocala, FL', end_loc:'Gainesville, FL'},
    //  {name: 'Race4', distance:37.4, distance_type: 'Mi', start_date: '06/11/2020', end_date: '07/11/2020', id:4, start_loc:'Ocala, FL', end_loc:'Gainesville, FL'},
    //];
    var races;

    this.http.get('http://localhost:8000/races/').subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log("errors: ", err);
      },
    );
  }

  setRace(raceID:number) {
    this.selectedRaceID = raceID
  }

  getRace() {
    return this.selectedRaceID;
  }


}

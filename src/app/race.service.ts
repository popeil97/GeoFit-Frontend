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
    return this.http.get('/api/races/')
  }

  getRace(race_id:number) {
    console.log(race_id)
    return this.http.post('/api/race/',{race_id:race_id});
  }

  joinRace(race_id:number) {
    console.log('service API attempt:',race_id);
    return this.http.post('/api/join/',{race_id:race_id}).toPromise();
  }

  getRaceAbout(race_id:number) {
    return this.http.post('/api/about/',{race_id:race_id}).toPromise();
  }

  updateRaceAbout(aboutForm:any,race_id:number) {
    return this.http.post('/api/updateAbout/',{form:aboutForm,race_id:race_id}).toPromise();
  }

  createRace(raceForm:any) {
    console.log('SERVICE FILE:',raceForm)
    return this.http.post('/api/create/',{form:raceForm}).toPromise();
  }


}

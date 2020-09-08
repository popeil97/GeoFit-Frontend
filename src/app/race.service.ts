import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

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
    return this.http.get(environment.apiUrl + '/api/races/')
  }

  getRace(race_id:number) {
    console.log(race_id)
    return this.http.post(environment.apiUrl + '/api/race/',{race_id:race_id});
  }

  joinRace(registrationBody:any) {
    console.log('Attempting to join race:',registrationBody);
    return this.http.post(environment.apiUrl + '/api/join/',registrationBody).toPromise();
  }

  getRaceAbout(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/about/',{race_id:race_id}).toPromise();
  }

  updateRaceAbout(aboutForm:any,race_id:number) {
    return this.http.post(environment.apiUrl + '/api/updateAbout/',{form:aboutForm,race_id:race_id}).toPromise();
  }

  createRace(raceForm:any) {
    console.log('SERVICE FILE:',raceForm)
    return this.http.post(environment.apiUrl + '/api/create/',{form:raceForm}).toPromise();
  }

  getUserRacestats(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-users-racestats/',{race_id:race_id}).toPromise();
  }

  getTeamOrUserStat(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-team-or-user-stat/',{race_id:race_id}).toPromise();
  }

}

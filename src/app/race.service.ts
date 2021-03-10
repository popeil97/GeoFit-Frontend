import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RaceService {

  // used to communicate with race-view-page component

  // http options used for making API calls
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }


  getRaces(user_id:number) {
    var apiURL = environment.apiUrl + '/race/list/';
    if (user_id) {
      apiURL += '?user_id=' + encodeURIComponent(user_id.toString());
    }
    return this.http.get(apiURL)
  }


  getRace(race_id:number) {
  //   console.log(race_id)
    return this.http.post(environment.apiUrl + '/race/',{race_id:race_id});
  }
  getRacePromise(race_id:number) {
    return this.http.post(environment.apiUrl + '/race/',{race_id:race_id}).toPromise();
  }

  joinRace(registrationBody:any) {
  //   console.log('Attempting to join race:',registrationBody);
    return this.http.post(environment.apiUrl + '/race/join/',registrationBody).toPromise();
  }

  getRaceAbout(race_id:number) {
    return this.http.post(environment.apiUrl + '/race/about/',{race_id:race_id}).toPromise();
  }

  updateRaceAbout(aboutForm:any,race_id:number) {
    return this.http.post(environment.apiUrl + '/race/about/update/',{form:aboutForm,race_id:race_id}).toPromise();
  }

  createRace(raceForm:any) {
  //   console.log('SERVICE FILE:',raceForm)
    return this.http.post(environment.apiUrl + '/race/create/',{form:raceForm}).toPromise();
  }

  getUserRacestats(race_id:number,page:number) {
    return this.http.post(environment.apiUrl + '/race/user-racestats/',{race_id:race_id,page:page}).toPromise();
  }

  getTeamOrUserStat(race_id:number) {
    return this.http.post(environment.apiUrl + '/race/team-or-user-stat/',{race_id:race_id}).toPromise();
  }

  getReportedStories(race_id: number){
    return this.http.post(environment.apiUrl + '/report/repoted/',{race_id:race_id}).toPromise();
  }

  getRaceSettings(race_id:number) {
    return this.http.post(environment.apiUrl + '/race-settings/get/',{race_id:race_id}).toPromise();
  }

  updateOrCreateRaceSettings(race_id:number,settingsForm:any) {
    return this.http.post(environment.apiUrl + '/race-settings/update-or-create/',{race_id:race_id,rules:settingsForm}).toPromise();
  }

  public updateMapRoute(race_form:any) {
    return this.http.post(environment.apiUrl + '/race/map-route-form/',{form:race_form}).toPromise();
  }

}

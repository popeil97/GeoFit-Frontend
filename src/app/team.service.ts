import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeamForm } from './team-form/team-form.component';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }

  createTeam(teamForm:TeamForm,race_id:number,isUpdate:Boolean,team_id?:number) {
    console.log('SERVICE RACEID:',race_id);
    return this.http.post(environment.apiUrl + '/api/create-team/',{team_form:teamForm,race_id:race_id,isUpdate:isUpdate,team_id:team_id}).toPromise();
  }

  joinTeam(user_id:number,race_id:number,team_id:number) {
    return this.http.post(environment.apiUrl + '/api/join-team/',{user_id:user_id,race_id:race_id,team_id:team_id}).toPromise();
  }

  quitTeam(race_id:number,team_id:number) {
    return this.http.post(environment.apiUrl + '/api/quit-team/',{race_id:race_id,team_id:team_id}).toPromise();
  }

  getTeam(team_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-team/',{team_id:team_id}).toPromise();
  }

  getTeamsList(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-teams/',{race_id:race_id}).toPromise();
  }
}

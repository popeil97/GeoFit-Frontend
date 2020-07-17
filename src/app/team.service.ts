import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeamForm } from './team-form/team-form.component';

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
    return this.http.post('/api/create-team/',{team_form:teamForm,race_id:race_id,isUpdate:isUpdate,team_id:team_id}).toPromise();
  }

  joinTeam(user_id:number,race_id:number,team_id:number) {
    return this.http.post('/api/join-team/',{user_id:user_id,race_id:race_id,team_id:team_id}).toPromise();
  }

  quitTeam(race_id:number,team_id:number) {
    return this.http.post('/api/quit-team/',{race_id:race_id,team_id:team_id}).toPromise();
  }

  getTeam(team_id:number) {
    return this.http.post('/api/get-team/',{team_id:team_id}).toPromise();
  }
}

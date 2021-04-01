import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // http options used for making API calls
  private httpOptions: any;

  // ID of which a story is liked, unliked or deleted 
  private storyID: number;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }

  getFollowedFollowerIDs(){
      let ret = this.http.post(environment.apiUrl + '/profile/list/',{}).toPromise();

      return ret['followed_ids'], ret['follower_ids']
  }

  //TODO: Move this outside of the users service. This is related to user race stats
  getUserStats(user_id){
      return this.http.post(environment.apiUrl + '/user-stats/',{user_id:user_id}).toPromise();
  }

  followUserWithID(user_id){
      return this.http.post(environment.apiUrl + '/profile/follow/',{follow_user_id: user_id}).toPromise();
  }

  unfollowUserWithID(user_id){
      return this.http.post(environment.apiUrl + '/profile/unfollow/',{follow_user_id: user_id}).toPromise();
  }

  getFollowersAndFollowed() {
    return this.http.get(environment.apiUrl + '/follower/union/').toPromise();
  }

  getFollowersAndFollowedSeperate(){
    return this.http.get(environment.apiUrl + '/follower/separate/').toPromise();
  }

  updateUserRaceSetting(form:any) {
    return this.http.post(environment.apiUrl + '/race-settings/update/',{form:form}).toPromise();
  }

  getLogos(race_id:number) {
  //   console.log(race_id)
    return this.http.post(environment.apiUrl + '/race-settings/logos/',{race_id:race_id}).toPromise();
  }

  //FUTURE: Block users etc

}

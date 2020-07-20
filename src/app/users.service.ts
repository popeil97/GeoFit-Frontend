import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';


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
      let ret = this.http.post(environment.apiUrl + '/api/users/',{}).toPromise();

      return ret['followed_ids'], ret['follower_ids']
  }

  getUserStats(user_id){
      return this.http.post(environment.apiUrl + '/api/user-stats/',{user_id:user_id}).toPromise();
  }

  followUserWithID(user_id){
      return this.http.post(environment.apiUrl + '/api/follow/',{follow_user_id: user_id}).toPromise();
  }

  unfollowUserWithID(user_id){
      return this.http.post(environment.apiUrl + '/api/unfollow/',{follow_user_id: user_id}).toPromise();
  }

  getFollowersAndFollowed() {
    return this.http.get(environment.apiUrl + '/api/get-followers-and-followed/').toPromise();
  }

  updateUserRaceSetting(form:any) {
    return this.http.post(environment.apiUrl + '/api/user-race-setting-update/',{form:form}).toPromise();
  }

  //FUTURE: Block users etc

}

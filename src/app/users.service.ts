import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      let ret = this.http.post('/api/users/',{}).toPromise();

      return ret['followed_ids'], ret['follower_ids']
  }

  getUserStats(user_id){
      return this.http.post('/api/user-stats/',{user_id:user_id}).toPromise();
  }

  followUserWithID(user_id){
      return this.http.post('/api/follow/',{follow_user_id: user_id}).toPromise();
  }

  unfollowUserWithID(user_id){
      return this.http.post('/api/unfollow/',{follow_user_id: user_id}).toPromise();
  }

  getFollowersAndFollowed() {
    return this.http.get('/api/get-followers-and-followed/').toPromise();
  }

  updateUserRaceSetting(form:any) {
    return this.http.post('/api/user-race-setting-update/',{form:form}).toPromise();
  }

  //FUTURE: Block users etc

}

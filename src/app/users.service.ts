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
      let ret = this.http.post('http://localhost:8000/api/users/',{}).toPromise();

      return ret['followed_ids'], ret['follower_ids']
  }

  followUserWithID(user_id){
      return this.http.post('http://localhost:8000/api/follow/',{follow_user_id: user_id}).toPromise();
  }

  unfollowUserWithID(user_id){
      return this.http.post('http://localhost:8000/api/unfollow/',{follow_user_id: user_id}).toPromise();
  }

  //FUTURE: Block users etc

}

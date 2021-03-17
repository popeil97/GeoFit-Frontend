import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from './../environments/environment';
import { Observable, Observer, Subject, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  /*
  General service for user info queries PLUS user feed service
  */

  // http options used for making API calls
  private httpOptions: any;

  // time since last refresh of feed
  public refresh_ts: any;

  // ID (username) of user this service queries
  public ID: string;

  constructor(private http:HttpClient, private router:Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  updateProfile(formClean:any){
    return this.http.post(environment.apiUrl + '/profile/update/', {'form': formClean}).toPromise();
  }

  goToUserProfile(username:string) {
    this.router.navigate(['/profile',{username:username}]);
  }

  requestUserProfile(username:string){
    return this.http.post(environment.apiUrl + '/profile/info/',{'username':username}).toPromise();
  }

  //Functions to refresh user feed
  public refreshFeed(page_num: number, items_per_page: number) {
    return this.http.post(environment.apiUrl + '/profile/feed/', {page_number : page_num, items_per_page: items_per_page, username: this.ID}).toPromise();
  }

  public resetFeed(){
    this.refresh_ts = null;
  }

}

/*
interface UserData {
  feed:any;
  email:any;
  first_name:any;
  last_name:any;
}
*/

interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  description: string;
  location:string;
  first_name:string;
  last_name:string;
  follows:boolean;
  distance_type: string;
  is_me: boolean;
  location_visibility:boolean;
  about_visibility:boolean;
  email_visibility:boolean;
}

export {
  UserData,
}
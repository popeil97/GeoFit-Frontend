import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  // http options used for making API calls
  private httpOptions: any;

  constructor(private http:HttpClient, private router:Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  goToUserProfile(username:string) {
    this.router.navigate(['/profile',{username:username}]);
  }

  getUserProfile(username:string){
    return this.http.post('http://localhost:8000/api/user-feed/',{'username':username}).toPromise();
  }

}

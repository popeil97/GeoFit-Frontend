import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 
@Injectable()
export class UserService {
 
  // http options used for making API calls
  private httpOptions: any;
 
  // the actual JWT token
  public token: string;
 
  // the token expiration date
  public token_expires: Date;
 
  // the username of the logged in user
  public username: string;
 
  // error messages received from the login attempt
  public errors: any = [];
 
  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }
 
  // Uses http.post() to register user from REST API endpoint
  public register(user) {
    console.log(JSON.stringify(user));
    this.http.post('http://localhost:8000/api/register/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        console.log(data);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }

  // Uses http.post() to get an auth token from djangorestframework-jwt endpoint
  public login(user) {
    console.log(JSON.stringify(user));
    this.http.post('http://localhost:8000/api/login/', JSON.stringify(user), this.httpOptions).subscribe(
      data => {
        console.log(data);
        //this.updateData(data['token']);
        localStorage.setItem('access_token', data['token']);
        console.log(localStorage.getItem('access_token'));
        localStorage.setItem('user', user);
        this.token = data['token'];
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  // Refreshes the JWT token, to extend the time the user is logged in
  public refreshToken() {
    console.log(JSON.stringify({token: this.token}));
    this.http.post('http://localhost:8000/api-token-refresh/', JSON.stringify({token: this.token}), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token']);
      },
      err => {
        this.errors = err['error'];
      }
    );
  }
 
  public logout() {
    //Remove JWT in local storage

    this.http.post('http://localhost:8000/api/logout/', JSON.stringify({}), this.httpOptions).subscribe(
      err => {
        this.errors = err['error'];
      }
    );

    //Only remove access token after logout
    localStorage.removeItem('access_token');
    console.log("logged out");

    this.token = null;
    this.token_expires = null;
    this.username = null;
  }
 
  private updateData(token) {
    this.token = token;
    this.errors = [];
 
    // decode the token to read the username and expiration timestamp
    const token_parts = this.token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    this.token_expires = new Date(token_decoded.exp * 1000);
    this.username = token_decoded.username;
  }
 
}
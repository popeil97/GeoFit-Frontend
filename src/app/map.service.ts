import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Injectable()
export class MapService {

  // http options used for making API calls
  private httpOptions: any;

  // error messages received from the login attempt
  public errors: any = [];

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public getMapData(raceID: number) {
    return this.http.post(environment.apiUrl + '/api/map/', {race_id : raceID}).toPromise();
  }

}

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
    return this.http.post(environment.apiUrl + '/race/map/', {race_id : raceID}).toPromise();
  }

  public getMapTrail(raceID: number) {
    return this.http.post(environment.apiUrl + '/race/map-route/', {race_id : raceID}).toPromise();
  }

  public getOrgPinStats(raceID:number) {
    return this.http.post(environment.apiUrl + '/race/org-pins/',{race_id:raceID}).toPromise();
  }

  public getUserPinSize(raceID:number) {
    let headers = new HttpHeaders();
    let url = '/race/user-pin-size/?race_id=%s';
    let url_formatted = url.replace('%s',raceID.toString());
    return this.http.get(environment.apiUrl + url_formatted).toPromise();
  }

  // getMyMarkers gets the latitude,longitude pairs of all of request user's
  // markers in race (or child races) of id raceID
  public getRaceMarkers(raceID:number){
    return this.http.post(environment.apiUrl + '/race/markers/', {race_id: raceID}).toPromise();
  }

}

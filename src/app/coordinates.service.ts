import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapBoxCoord } from './views/race-create/race-create.component';
import { environment } from './../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {

  constructor(private http:HttpClient) { }

  getCoordinates(start_coord:MapBoxCoord,end_coord:MapBoxCoord) {
    return this.http.post(environment.apiUrl + '/race/coordinates/',{start_lon:start_coord.lon, start_lat:start_coord.lat, end_lon:end_coord.lon, end_lat:end_coord.lat}).toPromise();
  }

  getLocation(query:string) {
    return this.http.post(environment.apiUrl + '/race/places-lookup/',{query:query}).toPromise();
  }
}

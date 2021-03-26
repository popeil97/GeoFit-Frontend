import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { 
  ItemType 
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private httpOptions: any;

  constructor(private http: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  public getRaceItems(raceID:number) {
    return this.http.post(environment.apiUrl + '/orders/merch-items/',{race_id:raceID}).toPromise();
  }

  public getItemByID(itemID:number) {
    return this.http.post(environment.apiUrl + '/orders/item/get-by-id/',{item_id:itemID}).toPromise();
  }

  public getItemsByType(raceID:number,itemType:ItemType) {
    return this.http.post(environment.apiUrl + '/orders/item/get-by-type/',{race_id:raceID,item_type:itemType}).toPromise();
  }

  public createItem(raceID:number,itemForm:any) {
    return this.http.post(environment.apiUrl + '/orders/item/create/',{race_id:raceID,item_form:itemForm}).toPromise();
  }

  public editItem(itemID:number,itemForm:any) {
    return this.http.post(environment.apiUrl + '/orders/item/edit/',{item_id:itemID, item_form:itemForm}).toPromise();
  }

  public editTeam(raceID:number,itemForm:any) {
    return this.http.post(environment.apiUrl + '/orders/items/edit/',{race_id:raceID,item_form:itemForm}).toPromise();
  }

  public deleteTeam(itemID:number) {
    return this.http.post(environment.apiUrl + '/orders/item/delete/',{item_id:itemID}).toPromise();
  }
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SwagService {

  private httpOptions:any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  getSwagForm(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/swagform-get/',{race_id:race_id}).toPromise();
  }

  updateSwagForm(race_id:number,form:any) {
    return this.http.post(environment.apiUrl + '/api/swagform-update/',{race_id:race_id,form:form}).toPromise();
  }

  getItems(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-merch-items/',{race_id:race_id}).toPromise();
  }

  getCart(race_id:number) {
    return this.http.post(environment.apiUrl + '/api/get-cart/',{race_id:race_id}).toPromise();
  }

  addToCart(item_id:number,details:string) {
    return this.http.post(environment.apiUrl + '/api/add-item-cart/',{item_id:item_id,details:details}).toPromise();
  }

  removeFromCart(order_id:number) {
    return this.http.post(environment.apiUrl + '/api/remove-item-cart/',{order_id:order_id}).toPromise();
  }
}

export interface Item {
  name:string,
  id:number,
  image:string,
  description:string,
  price:number,
  state:ItemState,
  type:ItemType,
}

export interface Order {
  item:Item,
  details:string,
  id:number
}

export interface Cart {
  orders:Order[],
  price:number,
  id:number
}

export enum ItemState {
  ACTIVE=1,
  INACTIVE=2
}

export enum ItemType {
  ENTRY=1,
  SWAG=2
}

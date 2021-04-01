import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';

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
    return this.http.post(environment.apiUrl + '/swag-form/',{race_id:race_id}).toPromise();
  }

  updateSwagForm(race_id:number,form:any) {
    return this.http.post(environment.apiUrl + '/swag-form/update/',{race_id:race_id,form:form}).toPromise();
  }

  getItems(race_id:number) {
    return this.http.post(environment.apiUrl + '/orders/merch-items/',{race_id:race_id}).toPromise();
  }

  getCart(race_id:number) {
    return this.http.post(environment.apiUrl + '/orders/cart/',{race_id:race_id}).toPromise();
  }

  addToCart(item_id:number,details:string) {
    return this.http.post(environment.apiUrl + '/orders/cart/item/add',{item_id:item_id,details:details}).toPromise();
  }

  removeFromCart(order_id:number) {
    return this.http.post(environment.apiUrl + '/orders/cart/item/remove',{order_id:order_id}).toPromise();
  }
}
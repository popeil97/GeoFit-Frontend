import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }

  test() {
    console.log('HI FROM SERVICE');
  }

  confirmPayment(payment:Payment) {
    return this.http.post(environment.apiUrl + '/api/payment-confirmed/',{payment:payment}).toPromise();
  }
}

export interface Payment {
  paid:number;
  currency:string;
  race_id:number;
  payment_id:string,
  status:string;
}
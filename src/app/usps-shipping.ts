import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from './../environments/environment';
import { query } from '@angular/animations';


@Injectable({
  providedIn: 'root'
})
export class USPSShippingService {

  // http options used for making API calls
  private httpOptions: any;

  // USPS User ID to authenticate requests
  private id: string;

  private usps: any;

  constructor (private http:HttpClient,
    private sanitizer: DomSanitizer) {
      this.id = '534TUCAN4881';

      this.httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }; 

  }

  public getUserAddresses(){
      return this.http.post(environment.apiUrl + '/api/user-addresses/', this.httpOptions).toPromise();
  }

  public submitAddress(address){
      return this.http.post(environment.apiUrl + '/api/shipping-conf/', address, this.httpOptions).toPromise();
  }

  public deleteAddress(id){
      return this.http.post(environment.apiUrl + '/api/shipping-del/', {'id': id}, this.httpOptions).toPromise();
  }

  getBodyFromQuery(query){
    var xml2js = require('xml2js');
 
    var addressDict = {}

    if ('address1' in query){
        addressDict['address1'] = query.address1;
    } else { addressDict['address1'] = ""; }

    if ('address2' in query){
        addressDict['address2'] = query.address2;
    } else { addressDict['address2'] = ""; }

    if ('city' in query){
        addressDict['city'] = query.city;
    } else { addressDict['city'] = ""; }

    if ('state' in query){
        addressDict['state'] = query.state;
    } else { addressDict['state'] = ""; }

    if ('zip5' in query){
        addressDict['zip5'] = query.zip5;
    } else { addressDict['zip5'] += ""; }

    if ('zip4' in query){
        addressDict['zip4'] = query.zip4;
    } else { addressDict['zip4'] = ""; }

    const { create } = require('xmlbuilder2');

    var obj = { AddressValidateRequest : {
        '@USERID': this.id,
        Address : {
            Address1: addressDict['address1'],
            Address2: addressDict['address2'],
            City: addressDict['city'],
            State: addressDict['state'],
            Zip5: addressDict['zip5'],
            Zip4: addressDict['zip4'],
        }
    }};

    
 
    const doc = create(obj);
    const xml = doc.end({ prettyPrint: true });
    console.log(xml);
    
    return encodeURI(xml);
  }

  validateAddress(form){
    var body = this.getBodyFromQuery(form);

    console.log(body);

    const url = 'http://production.shippingapis.com/ShippingAPI.dll?API=Verify&XML='+body;
    console.log(url);

    return this.http.post(environment.apiUrl + '/api/shipping-val/', {'url': url},  this.httpOptions).toPromise()

  }
}

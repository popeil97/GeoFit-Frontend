import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { env } from 'process';
import { TagFormObj } from './tag-form/tag-form.component';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  private httpOptions:any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  getTags(race_id:number,tag_type:TagType) {
    return this.http.post(environment.apiUrl + '/api/get-tags/',{race_id:race_id,tag_type:tag_type}).toPromise();
  }

  addTag(tagBody:TagFormObj, img:any) {
    let payload = {
      tag:tagBody
    } as any;

    if(img) {
      payload.img = img;
    }

    return this.http.post(environment.apiUrl + '/api/add-tag/',payload).toPromise();
  }

  removeTag(tag_id:number) {
    return this.http.post(environment.apiUrl + '/api/delete-tag/',{id:tag_id}).toPromise();
  }


}

export interface Tag {
  name:string,
  type:number,
  id:number,
}

export enum TagType {
  ENTRY=1,
  OWNER=2,
}

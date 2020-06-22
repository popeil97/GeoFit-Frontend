import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { text } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  // used to communicate with race-view component

  // http options used for making API calls
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }; 
  }


  uploadStory(race_id, img_data, text_data, withLastStory){
      console.log(img_data);
      console.log(text_data);
      return this.http.post('http://localhost:8000/api/story-upload/',{race_id: race_id,storyImg:img_data, storyText:text_data}).toPromise();
  }


}

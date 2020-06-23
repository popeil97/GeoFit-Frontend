import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { text } from '@angular/core/src/render3';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  // http options used for making API calls
  private httpOptions: any;

  // ID of which a story is liked, unliked or deleted 
  private storyID: number;

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

  //TODO: FLESH OUT THESE CALLS
  changeLikeStatus(){
      return this.http.post('http://localhost:8000/api/story-like/',{user_story_id: this.storyID}).toPromise();
  }

  deleteStory(){
      return this.http.post('http://localhost:8000/api/story-delete/',{user_story_id: this.storyID}).toPromise();
  }

  getStoryLikes(){
      return this.http.post('http://localhost:8000/api/story-like-count/',{user_story_id: this.storyID}).toPromise();
  }

}

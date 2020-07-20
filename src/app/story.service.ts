import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { text } from '@angular/core/src/render3';
import { environment } from './../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class StoryService {

  // http options used for making API calls
  private httpOptions: any;

  constructor(private http:HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  uploadStory(race_id, img_data, text_data, withLastStory){
      return this.http.post(environment.apiUrl + '/api/story-upload/',{race_id: race_id,storyImg:img_data, storyText:text_data}).toPromise();
  }

  changeLikeStatus(storyID){
      return this.http.post(environment.apiUrl + '/api/story-like/',{user_story_id: storyID}).toPromise();
  }

  deleteStory(storyID){
      return this.http.post(environment.apiUrl + '/api/story-delete/',{user_story_id: storyID}).toPromise();
  }

  getStoryLikes(storyID){
      return this.http.post(environment.apiUrl + '/api/story-like-count/',{user_story_id: storyID}).toPromise();
  }

  getStoryModalData(storyID){
      return this.http.post(environment.apiUrl + '/api/story-modal/',{story_id: storyID}).toPromise();
  }

  getComments(storyID){
      return this.http.post(environment.apiUrl + '/api/story-comments/',{story_id: storyID}).toPromise();
  }

  postComment(storyID, formClean){
      return this.http.post(environment.apiUrl + '/api/story-comment-post/', {form:formClean, story_id: storyID}).toPromise();
  }

}

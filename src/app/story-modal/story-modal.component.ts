import { Component, OnInit, Input } from '@angular/core';
import { StoryService } from '../story.service';
import { AuthService } from '../auth.service';

declare var $: any;

@Component({
  selector: 'app-story-modal',
  templateUrl: './story-modal.component.html',
  styleUrls: ['./story-modal.component.css']
})
export class StoryModalComponent implements OnInit {
  storyItem: FeedObj;

  constructor(private _storyService: StoryService,
              private _authService: AuthService) { }

  ngOnInit() {
  }

  showModal(storyID):void {
  //   console.log("querying with ID: ", storyID);
    this._storyService.getStoryModalData(storyID).then((data) => {
      this.storyItem = data as FeedObj;
      $("#storyModal").modal('show');
    })
  }

  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }

}

interface FeedObj {
  user_id: number;
  display_name: string;
  username: string;
  profile_url:string
  joined: boolean;
  traveled: boolean;
  likes: boolean;
  likes_count: number;
  story: boolean;
  story_image:string;
  story_text:string;
  story_id:number;
  total_distance:number;
  last_distance:number;
  message: string;
  created_ts:number;
  is_mine:boolean;
  comments: Comment[];
}

interface Comment {
  display_name:string;
  username: string;
  profile_url:string;
  body:string;
  created_ts:number;
}

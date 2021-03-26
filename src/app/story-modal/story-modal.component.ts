import { Component, OnInit, Input } from '@angular/core';
import { 
  AuthService,
  StoryService,
} from '../services';
import {
  Comment,
  FeedObj,
} from '../interfaces';

declare var $: any;

@Component({
  selector: 'app-story-modal',
  templateUrl: './story-modal.component.html',
  styleUrls: ['./story-modal.component.css']
})
export class StoryModalComponent implements OnInit {
  storyItem: FeedObj;

  constructor(
    private _storyService: StoryService,
    private _authService: AuthService
  ) { }

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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { 
  StoryService 
} from '../services';

@Component({
  selector: 'app-comments-form',
  templateUrl: './comments-form.component.html',
  styleUrls: ['./comments-form.component.css']
})
export class CommentsFormComponent implements OnInit {
  //ID of story to post comments to
  @Input() storyID: number;
  private storyText: string;

  //Emit when new comment posted by user
  @Output() commentPosted: EventEmitter<any> = new EventEmitter();

  commentForm: FormGroup;

  constructor(
    private _storyService: StoryService
  ) {
    this.commentForm = new FormGroup({
      body: new FormControl('',[
        Validators.required,
        Validators.maxLength(1000)
      ]),
    });
  }

  ngOnInit() {
  }

  addText(element:any)
  {
    this.storyText = (<HTMLInputElement>document.getElementById("storyCommentCaption"+this.storyID)).value;
    console.log("STRY",this.storyText);
    (<HTMLInputElement>document.getElementById("storyCommentCaption"+this.storyID)).value = this.storyText + element;
  }


  submitCommentForm(){
    let formClean = this.commentForm.value as CommentForm;
    let isValid: Boolean = this.commentForm.valid;

    var commentPosted = this.commentPosted;
    console.log("COMMENT",this.commentPosted,isValid);
    if (isValid){
      this._storyService.postComment(this.storyID, formClean).then((data) => {
        commentPosted.emit();
        this.commentForm.reset();
      });
    }
  }

}

interface CommentForm{
  body:string;
}

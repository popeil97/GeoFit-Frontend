import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoryService } from '../story.service';

@Component({
  selector: 'app-story-form',
  templateUrl: './story-form.component.html',
  styleUrls: ['./story-form.component.css']
})
export class StoryFormComponent implements OnInit {
  @Input() raceID:number;

  @Output() storyPostedEvent = new EventEmitter();

  private storyText: string;

  private storyImage:any;

  constructor(private storyService: StoryService) { }

  ngOnInit() {
  }

  onSelectFile(event){
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.storyImage = reader.result;
      }
    }
  }

  uploadStory(): void{
    //This bool tells Django whether to add these fields to the user's last story
    //or simply create a new story that has no activities
    //False by default but implement mechanism for true in future
    console.log("uploading story");
    console.log("Story image: ", this.storyImage);
    let withLastStory = false;

    //Get text field input (image already uploaded via eventListener)
    this.storyText = (<HTMLInputElement>document.getElementById("storyImageCaption")).value;

    //Upload story via service
    this.storyService.uploadStory(this.raceID, this.storyImage, this.storyText, withLastStory);

    //Clear input fields
    (<HTMLInputElement>document.getElementById("storyImage")).value = '';
    (<HTMLInputElement>document.getElementById("storyImageCaption")).value = '';
    this.storyText = null;
    this.storyImage = null;
    
    //Emit event to refresh feed
    this.storyPostedEvent.emit();
  }

  // setStoryImageFieldListener(){
  //   //LISTENS TO CHANGES IN IMAGE FILE UPLOAD
  //   var setStoryImg = this.setStoryImage;
  //   var viewComponent = this;

  //   var storyImageField = <HTMLInputElement>document.getElementById("storyImage");

  //   console.log("adding story event listener: ", storyImageField);

  //   storyImageField.addEventListener('change', function() {
  //     console.log("thanks for the picture!");
  //     var file = this.files[0];
  //     var reader: FileReader = new FileReader();
  //     reader.onload = function(e) {
  //         setStoryImg(viewComponent, reader.result);
  //     }
  //     reader.readAsDataURL(file);
  //   }, false);

  //   console.log("added story event listener");

  // }

}

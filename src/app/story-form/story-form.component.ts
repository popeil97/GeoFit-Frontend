import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoryService } from '../story.service';
import { ImageService } from '../image.service';

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

  constructor(private storyService: StoryService,
              private _imageService: ImageService) { }

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
    console.log("uploading story");
    console.log("Story image: ", this.storyImage);
    let withLastStory = false;

    //Resize story images if one dim > 1000px
    if (this.storyImage){
      this.storyImage = this._imageService.resizeImage(this.storyImage, 1000, 1000);
    }

    //Get text field input (image already uploaded via eventListener)
    this.storyText = (<HTMLInputElement>document.getElementById("storyImageCaption")).value;

    //Upload story via service
    this.storyService.uploadStory(this.raceID, this.storyImage, this.storyText, withLastStory).then( data =>
    {
      //Emit event to refresh feed
      this.storyPostedEvent.emit();

      //Clear input fields
      (<HTMLInputElement>document.getElementById("storyImage")).value = '';
      (<HTMLInputElement>document.getElementById("storyImageCaption")).value = '';
      this.storyText = null;
      this.storyImage = null;
    });
    
  }

}

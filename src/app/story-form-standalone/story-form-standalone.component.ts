import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StoryService } from '../story.service';
import { ImageService } from '../image.service';
import { ModalService } from '../modalServices';

@Component({
  selector: 'app-story-form-standalone',
  templateUrl: './story-form-standalone.component.html',
  styleUrls: ['./story-form-standalone.component.css']
})
export class StoryFormStandaloneComponent implements OnInit {
	@Input() id: string;
 // @Input() raceID:number;

  //@Output() storyPostedEvent = new EventEmitter();

  private storyText: string;

  public storyImage:any;

  constructor(private storyService: StoryService,
              private _imageService: ImageService,private modalService: ModalService) { }

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
 //    console.log("uploading story");
//     console.log("Story image: ", this.storyImage);
    let withLastStory = false;

    //Get text field input (image already uploaded via eventListener)
    this.storyText = (<HTMLInputElement>document.getElementById("storyImageCaption")).value;

    //Resize story images if one dim > 1000px
    if (this.storyImage){
      this._imageService.resizeImage(this.storyImage, 800, 800).then((data) => {
        this.storyImage = data;
     //    console.log(this.storyImage);
        //Upload story via service
        this.uploadStoryWithService(this.d.raceID, this.storyImage, this.storyText, withLastStory);
      });
    }
    else {
      this.uploadStoryWithService(this.d.raceID, this.storyImage, this.storyText, withLastStory);
    }
    this.closeDialog();
    
  }

  uploadStoryWithService(raceID, storyImage, storyText, withLastStory){
    this.storyService.uploadStory(raceID, storyImage, storyText, withLastStory).then( data =>
      {
      //   console.log("Uploaded story");
        //Emit event to refresh feed
       // this.storyPostedEvent.emit();
       console.log("TEST SENT");
       	this.modalService.callbackModal(this.id,"test");
        //Clear input fields
        (<HTMLInputElement>document.getElementById("storyImage")).value = '';
        (<HTMLInputElement>document.getElementById("storyImageCaption")).value = '';
        this.storyText = null;
        this.storyImage = null;
      });
  }

    get d() { return this.modalService.modalsData[this.id]}

  closeDialog() {
    if (this.id == null) return;
    this.modalService.close(this.id);
  }

}

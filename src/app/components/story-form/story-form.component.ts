import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { 
  ImageService,
  StoryService,
  RouterService,
  TucanValidators,
} from '../../services';


@Component({
  selector: 'app-story-form',
  templateUrl: './story-form.component.html',
  styleUrls: [
    './story-form.component.css',
    '../../../styles/forms.css',
  ]
})

export class StoryFormComponent implements OnInit,AfterViewInit,OnDestroy {
  
  @Input() raceID:number;
  @Output() storyPostedEvent = new EventEmitter();
  @Output() logActivityEvent = new EventEmitter();

  public form:FormGroup = null;
  private formChangesSubscription:any = null;
  private storyTextRef:any = null;
  private storyImageRef:any = null;
  public storyImageURL:any = null;

  private storyText: string;
  public acceptedEmojis = ['😁','😊','🤪','😂','🥳','😲','😉','😭',
                           '🤟','💪','👏','❤️','🔥','🍻','🏃‍','🏃‍♀️',
                          '🚴‍♂️','👟','🍂','🌲','☀️','❄️','🌄','🌇'];
  public emojis:Boolean = false;

  constructor(
    private storyService: StoryService,
    private _imageService: ImageService,
    private fb:FormBuilder,
    private routerService:RouterService,
  ) {}

  ngOnInit() {
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.storyTextRef = document.getElementById('storyTextInput');
    this.storyImageRef = document.getElementById('storyImageInput');
  }
  ngOnDestroy() {
    this.form = null;
    this.formChangesSubscription.unsubscribe();
    this.formChangesSubscription = null;
    this.storyTextRef = null;
    this.storyImageRef = null;
    this.storyImageURL = null;
  }

  initializeForm = () => {
    this.form = this.fb.group({
      storyText:['',Validators.compose([
        Validators.required,
        TucanValidators.cannotBeEmptyString(),
        Validators.maxLength(100),
      ])],
      storyImage:[null,Validators.compose([
        TucanValidators.requiredFileType(false, ['png','jpg','jpeg'])
      ])]
    });
    this.formChangesSubscription = this.form.valueChanges.subscribe(values=>{
      const changed = values.storyText.length > 0 || values.storyImage != null;
      console.log("FORM CHANGE",values,changed);
      this.routerService.formHasChanged(changed);
    });
    this.storyImageURL = null;
  }
  get c() {
    return this.form.controls;
  }
  _isFormValid = ():Boolean => {
    return TucanValidators.isFormValid(this.form);
  }
  onSelectImageClick = (e:any) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.storyImageRef.click();
  }
  onSelectImageFile = (e:any) => {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]); // read file as data url
      reader.onload = () => {
        this.storyImageURL = reader.result;
      }
    }
  }


  addText = (element:any) => {
    const text = this.form.get('storyText').value;
    this.form.get('storyText').setValue(text + element);
  }

  toggleEmojis = () => {
    this.emojis = !this.emojis;
  }

  uploadStory = ():void => {
    // console.log("uploading story");
    // console.log("Story image: ", this.storyImage);
    let withLastStory = false;
    const valid = this._isFormValid();
    if (!valid) {
      return;
    }
    
    //Get text field input (image already uploaded via eventListener)
    const text = this.form.get('storyText').value;
    //Resize story images if one dim > 1000px
    if (this.storyImageURL != null){
      this._imageService.resizeImage(this.storyImageURL, 800, 800).then((data) => {
        this.storyImageURL = data;
        this.uploadStoryWithService(this.raceID, this.storyImageURL, text, withLastStory);
      });
    }
    else {
      this.uploadStoryWithService(this.raceID, this.storyImageURL, text, withLastStory);
    }
  }

  uploadStoryWithService(raceID:number, storyImage:any, storyText:string, withLastStory:Boolean){
    this.storyService.uploadStory(raceID, storyImage, storyText, withLastStory).then( data => {
      //Emit event to refresh feed
      this.storyPostedEvent.emit();

      //Clear input fields
      this.initializeForm();
    }).catch(error=>{
      console.error('Error Uploading Story:',error);
      const message = (error.error)
        ? error.error 
        : (error.message)
          ? error.message 
          : JSON.stringify(error);
      alert("You are currently unable to upload this story due to an error: " + message);
    });
  }

  logActivity() {
    console.log("hi emittingg...");
    this.logActivityEvent.emit("emitting");
  }

  deletePic = (e:any) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    //Clear uploaded file
    this.storyImageURL = null;
    this.form.get('storyImage').reset();
  }

}
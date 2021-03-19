import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { 
  AuthService,
  UserProfileService,
  ImageService,
  TucanValidators,
} from '../services';
import {
  UserData,
} from '../models';

@Component({
  selector: 'app-profile-pic-form',
  templateUrl: './profile-pic-form.component.html',
  styleUrls: ['./profile-pic-form.component.css']
})
export class ProfilePicFormComponent implements OnInit,AfterViewInit,OnDestroy {
  
  public initializing:Boolean = true;

  @Input() userData: UserData;
  @Output() formUpdated: EventEmitter<void> = new EventEmitter();

  public defaultURL:any = null;
  public profileInput:any = null;
  public profileForm: FormGroup = null;
  public profilePicURL:any = null;
  public profilePicUploading:Boolean = false;

  public checkingValidityOfSubmission:Boolean = false;
  public updatingItem:Boolean = false;

  constructor(
    private _userProfileService: UserProfileService, 
    private sanitizer:DomSanitizer,
    private _imageService: ImageService,
    private _authService: AuthService,
  ) {
    this.initializeForm();
  }

  ngOnInit() {}

  /*
  getUserData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.requestUserProfile(this.username).then((data) => {
      this.userData = data as UserData;
      console.log("New user data: ", this.userData);

      if (this.userData.location == "") {
        this.userData.location = "N/A";
      }

      if (this.userData.description == "") {
        this.userData.description = "N/A";
      }
    });
  }
  */

  ngAfterViewInit() {
    this.profileInput = document.getElementById("ProfilePicInput");
  }

  ngOnDestroy() {
    this.profileInput = null;
    this.profileForm = null;
    this.profilePicURL = null;
  }

  initializeForm() {
    this.defaultURL = (this.userData != null) ? this.userData.profile_url : null;
    this.profilePicURL = this.defaultURL;
    this.profileForm = new FormGroup({
      ProfilePic: new FormControl(this.defaultURL),
    });
    this.initializing = false;
  }
  validForm = () => {
    return TucanValidators.isFormValid(this.profileForm);
  }
  onFormSubmit = (e:any) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    this.checkingValidityOfSubmission = true;
    const valid = this.validForm();
    if (!this.validForm || this.profilePicURL == null) {
      console.log("INVALID FORM");
      this.checkingValidityOfSubmission = false;
      return;
    }
    var formClean = {
      "ProfilePic": this._imageService.squareCropImage(this.profilePicURL)
    }
    // Finally make the push
    this.updatingItem = true;
    this._userProfileService.updateProfile(formClean).then((data) => {
      //this.modalService.callbackModal(this.id,"profile-done");
      this.updatingItem = false;
      if (data["success"]) {
        this.checkingValidityOfSubmission = false;
        this.defaultURL = this.profilePicURL;
        this.formUpdated.emit();
      } else {
        alert("An error occurred while updating your profile info!");
        this.checkingValidityOfSubmission = false;
      }
    }).catch(error=>{
      console.error(error);
      alert("An error occurred while updating your profile info!");
      this.checkingValidityOfSubmission = false;
      this.updatingItem = false;
    }) 
  }
  onClickProfilePicUpload = (e:any) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.profileInput.click();
  }
  onSelectProfilePicFile(e:any) {
    e.preventDefault();
    e.stopPropagation();
    const input = this.profileForm.get('ProfilePic');
    if (
      input.errors != null ||
      e.target.files == null ||
      e.target.files.length == 0
    ) {
      this.profilePicUploading = false;
      input.setErrors({invalid:true});
      return;
    }
    this.profilePicUploading = true;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => { // called once readAsDataURL is completed
      this.profilePicURL = reader.result;
      this.profilePicUploading = false;
    }
    reader.readAsDataURL(file); // read file as data url
  }
  cancelProfilePicUpload = (e:any) => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    //Clear field form
    this.profileForm.get('ProfilePic').reset();
    //Clear uploaded file
    this.profilePicURL = null;
    this.profilePicUploading = false;
    this.updatingItem = false;
  }

  /*
  updateProfile(): void{
    let formClean: ProfilePic;

    if (this.profileForm.valid){
      formClean = this.profileForm.value;

      //Crop image, and resize image to handle large files
      if (this.profilePicURL){
        this.profilePicURL = this._imageService.squareCropImage(this.profilePicURL);
        
        this._imageService.resizeImage(this.profilePicURL, 350, 350).then((data) => {
          formClean.ProfilePic = data;

          //call service to update form
          this._userProfileService.updateProfile(formClean).then((data) => {
            this.formUpdated.emit();
          })
        });
      }
      else{
        //call service to update form
        this._userProfileService.updateProfile(formClean).then((data) => {
          this.formUpdated.emit();
        })
      }

      
    }
    this.profileUpdated = true;
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.profilePicURL = reader.result;
      }
    }
  }

  uploadedProfPicSrc() {
    //This allows base64 uploaded pics to be displayed
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.profilePicURL);
  }
  deleteProfilePic = () => {
    //Clear field form
    this.profileForm.get('ProfilePic').reset();

    //Clear uploaded file
    this.profilePicURL = null;
  }
  */
}

export interface ProfilePic {
  ProfilePic: any;
  FirstName: string;
  LastName: string;
  About: string;
  Location: string;
  DistanceType: string;
}


import { Component, OnChanges, OnInit, AfterViewInit, Output, EventEmitter, Input, SimpleChanges, OnDestroy, Inject, NgModule } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UserProfileService } from '../userprofile.service';
import { ImageService } from '../image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from '../modalServices';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit,AfterViewInit,OnDestroy  {
 // @Input() userData: UserData;
 @Input() id: string;

 // @Output() formUpdated: EventEmitter<void> = new EventEmitter();

  public initializing:Boolean = true;
  public profileForm:FormGroup = null;
  public checkingValidityOfSubmission:Boolean = false;
  public validForm:Boolean = true;

  public profilePicURL:any = null;
  public profilePicInput:any = null;
  public profilePicUploading:Boolean = false;

  distanceTypeOptions: any[];

  public submitted = false;

  constructor(
    private _userProfileService: UserProfileService, 
    //private sanitizer:DomSanitizer,
    private _imageService: ImageService,
    //private modalService: ModalService,

    public dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef : MatDialogRef<ProfileFormComponent>,
  ) {
    this.initializeForm();
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.profilePicInput = document.getElementById('ProfilePicInput');
    window.scroll(0,0);
  }
  /* LEGACY CODE
  ngOnChanges(changes: SimpleChanges): void {
    //console.log("CHANGES");
    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {
        console.log("PROP", propName);
        switch(propName) {
          case 'userData':
            if(changes.userData.currentValue != undefined) {
              this.initializeForm();
            }
        }
      }
    }
  }
  */
  ngOnDestroy() {
    this.cleanComponentForClosing();
  }
  cleanComponentForClosing = (callback:any = null) => {
    this.initializing = true;
    this.profileForm = null;
    this.profilePicURL = null;
    this.profilePicInput = null;
    if (callback) callback();
  }

  initializeForm = ():void => {
    this.initializing = true;

    this.distanceTypeOptions = ['Mi', 'KM'];
    this.checkingValidityOfSubmission = false;
    this.validForm = true;

    this.profileForm = new FormGroup({
      FirstName: new FormControl(this.data.first_name,[
        Validators.required,
        Validators.maxLength(30)
      ]),
      LastName: new FormControl(this.data.last_name,[
        Validators.required,
        Validators.maxLength(30)
      ]),
      About: new FormControl(this.data.description),
      Location: new FormControl(this.data.location,[
        Validators.maxLength(30)
      ]),
      //DistanceType: new FormControl(this.data.),
      emailToggle: new FormControl(this.data.email_visibility, [
        Validators.required,
      ]),
      locationToggle: new FormControl(this.data.location_visibility, [
        Validators.required,
      ]),
      aboutToggle: new FormControl(this.data.about_visibility, [
        Validators.required,
      ]),
      ProfilePic: new FormControl(this.data.profile_url),
    });
    this.profilePicURL = this.data.profile_url;

    this.initializing = false;
  }
  resetForm = (e:any):void => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.initializeForm();
  }
  onFormSubmit = (e:any) => {

    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();

    const keyDictionary = {
      "FirstName":"first_name",
      "LastName":"last_name",
      "About":"description",
      "Location":"location",
      "emailToggle":"email_visibility",
      "aboutToggle":"about_visibility",
      "locationToggle":"location_visibility",
      "ProfilePic":"profile_url"
    }
    this.checkingValidityOfSubmission = true;
    this.validForm = this.isFormValid(this.profileForm);
    if (!this.validForm) {
      console.log("INVALID FORM");
      this.checkingValidityOfSubmission = false;
      return;
    }
    var formClean = {};
    const values = this.profileForm.value;
    Object.keys(values).forEach(key=>{
      var formVal = (key == "ProfilePic") ? this.profilePicURL : this.profileForm.get(key).value;
      if (formVal != this.data[keyDictionary[key]]) {
        if (key == "ProfilePic") formVal = this._imageService.squareCropImage(this.profilePicURL);
        formClean[key] = formVal;
      }
    });
    if (Object.keys(formClean).length == 0) {
      // No changes were actually made... bummer
      this.checkingValidityOfSubmission = false;
      return;
    }
    // Finally make the push
    this._userProfileService.updateProfile(formClean).then((data) => {
      //this.modalService.callbackModal(this.id,"profile-done");
      if (data["success"]) {
        this.checkingValidityOfSubmission = false;
        this.dialogRef.close(true)
      } else {
        alert("An error occurred while updating your profile info!");
        this.checkingValidityOfSubmission = false;
      }
    }).catch(error=>{
      console.error(error);
      alert("An error occurred while updating your profile info!");
      this.checkingValidityOfSubmission = false;
    }) 
  }
  isFormValid = (f:FormGroup) => {
    if (!f.disabled) return f.valid;
    return Object.keys(f.controls).reduce((accumulator,inputKey)=>{
      return (accumulator && f.get(inputKey).errors == null);
    },true);
  }
  /* LEGACY CODE
  updateProfile() {
    this.submitted = true;
    let formClean = {};

    if (this.profileForm.valid){
      formClean = this.profileForm.value;
      //Crop image, and resize image to handle large files
      if (this.profilePicURL){
        this.profilePicURL = this._imageService.squareCropImage(this.profilePicURL);
        this._imageService.resizeImage(this.profilePicURL, 350, 350).then((data) => {
          formClean["ProfilePic"] = data;

          //call service to update form
          this._userProfileService.updateProfile(formClean).then((data) => {
            this.modalService.callbackModal(this.id,"profile-done");
          })
        });
      }
      else{
        //call service to update form
        this._userProfileService.updateProfile(formClean).then((data) => {
         this.modalService.callbackModal(this.id,"profile-done");
        })
      } 
    }
  }
  */

  onClickProfilePicUpload(e:any) {
    if (!this.profilePicUploading) this.profilePicInput.click();
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
    this.profilePicURL = this.data.profile_url;
    this.profilePicUploading = false;
  }
    /* LEGACY CODE
  uploadedProfPicSrc() {
    //This allows base64 uploaded pics to be displayed
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.profilePicURL);
  }
  */

  closeDialog = () => {
    this.cleanComponentForClosing(()=>{
      this.dialogRef.close(false)
    });
  }
}

enum DistanceTypes {
  "Mi"=1,
  "KM"=2,
}
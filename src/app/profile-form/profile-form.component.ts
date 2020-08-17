import { Component, OnChanges, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserProfileService } from '../userprofile.service';
import { ImageService } from '../image.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit, OnChanges {
  @Input() userData: UserData;

  @Output() formUpdated: EventEmitter<void> = new EventEmitter();

  profileForm: FormGroup;
  profilePicURL: any;
  distanceTypeOptions: any[];

  constructor(private _userProfileService: UserProfileService, 
              private sanitizer:DomSanitizer,
              private _imageService: ImageService) {
    this.distanceTypeOptions = ['Mi', 'KM'];
    this.profilePicURL = null;

    this.profileForm = new FormGroup({
      ProfilePic: new FormControl(''),
      FirstName: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      LastName: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      About: new FormControl(''),
      Location: new FormControl('',[
        Validators.maxLength(30)
      ]),
      DistanceType: new FormControl(''),
    });
  }

  ngOnInit() {
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {

    for(const propName in changes) {
      if(changes.hasOwnProperty(propName)) {

        switch(propName) {
          case 'userData':
            if(changes.userData.currentValue != undefined) {
              this.populateForm();
            }
        }
      }
    }
  }

  populateForm(): void {
    console.log("User data: ", this.userData);

    this.profileForm.get('FirstName').setValue(this.userData.first_name);
    this.profileForm.get('LastName').setValue(this.userData.last_name);
    this.profileForm.get('About').setValue(this.userData.description);
    this.profileForm.get('Location').setValue(this.userData.location);
  }

  updateProfile(): void{
    let formClean: ProfileForm;

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

  deleteProfilePic() {
    //Clear field form
    this.profileForm.get('ProfilePic').reset();

    //Clear uploaded file
    this.profilePicURL = null;
  }

}

export interface ProfileForm {
  ProfilePic: any;
  FirstName: string;
  LastName: string;
  About: string;
  Location: string;
  DistanceType: string;
}

interface UserData {
  user_id:number;
  profile_url:string;
  email:string;
  description: string;
  location:string;
  first_name:string;
  last_name:string;
  follows:boolean;
  distance_type: string;
}


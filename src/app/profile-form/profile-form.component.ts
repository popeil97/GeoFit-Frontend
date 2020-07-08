import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserProfileService } from '../userprofile.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  @Output() formUpdated: EventEmitter<void> = new EventEmitter();

  profileForm: FormGroup;
  profilePicURL: any;
  distanceTypeOptions: any[];

  constructor(private _userProfileService: UserProfileService, private sanitizer:DomSanitizer) {
    this.distanceTypeOptions = ['Miles', 'Kilometres'];
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
        Validators.required,
        Validators.maxLength(30)
      ]),
      DistanceType: new FormControl(''),
    });
  }

  ngOnInit() {
  }

  updateProfile(): void{
    let formClean: ProfileForm;

    if (this.profileForm.valid){
      formClean = this.profileForm.value;
      formClean.ProfilePic = this.profilePicURL;

      //call service to update form
      this._userProfileService.updateProfile(formClean).then((data) => {
        this.formUpdated.emit();
      })
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


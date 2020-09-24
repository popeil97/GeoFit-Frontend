import { Component, OnChanges, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserProfileService } from '../userprofile.service';
import { ImageService } from '../image.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile-pic',
  templateUrl: './profile-pic.component.html',
  styleUrls: ['./profile-pic.component.css']
})
export class ProfilePicComponent implements OnInit, OnChanges {
  
  @Input() userData: UserData;
  @Output() formUpdated: EventEmitter<void> = new EventEmitter();

  profileForm: FormGroup;
  profilePicURL: any;
  distanceTypeOptions: any[];
  public profileUpdated:boolean;

  constructor(
    private _userProfileService: UserProfileService, 
    private sanitizer:DomSanitizer,
    private _imageService: ImageService,
    private _authService: AuthService,
  ) {
    this.distanceTypeOptions = ['Mi', 'KM'];
    this.profilePicURL = null;

    this.profileForm = new FormGroup({
      ProfilePic: new FormControl(''),
    });
  }

  ngOnInit() {

    console.log('Welcome:',this._authService);

    //this.route.paramMap.subscribe(params => {
    //  this.username = params['params']['username'];
    //  this.getUserData();
    //  console.log(this.username);
    //});

    this.populateForm();
    this.profileUpdated = false;
  }

  /*
  getUserData(){
    //Call a to-be-created service which gets user data, feed, statistics etc
    this._userProfileService.getUserProfile(this.username).then((data) => {
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
  }

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

  deleteProfilePic() {
    //Clear field form
    this.profileForm.get('ProfilePic').reset();

    //Clear uploaded file
    this.profilePicURL = null;
  }

}

export interface ProfilePic {
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


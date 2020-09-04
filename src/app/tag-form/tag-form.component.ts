import { Component, OnInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators} from '@angular/forms';
import { TagsService, Tag, TagType } from '../tags.service';
import { Control } from 'leaflet';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.css']
})
export class TagFormComponent implements OnInit {

  tagForm:FormGroup;
  entryTags:Tag[];
  uploadedUrl:any;
  @Input() raceID:number;
  @Input() tagType:TagType;

  constructor(private _tagService:TagsService) { }

  ngOnInit() {
    this.getTags();

    this.tagForm = new FormGroup({
      name: new FormControl('',[
        Validators.required,
        Validators.maxLength(30)
      ]),
      race_id: new FormControl(this.raceID,[
        Validators.required,
      ]),
      tag_type: new FormControl(this.tagType,[
        Validators.required,
      ]),
      tag_img: new FormControl('')
    });
  }

  getTags() {
    this._tagService.getTags(this.raceID,this.tagType).then((tags:any) => {
      this.entryTags = tags['tags'];
    });
  }

  addTag() {
    let formClean = this.tagForm.value as any;
    formClean.tag_img = this.uploadedUrl;
    
    console.log(this.tagForm);
    let isValid: Boolean = this.tagForm.valid;

    if(isValid && formClean.name != '') {
      this._tagService.addTag(formClean,this.uploadedUrl).then((resp:any) =>{
        this.uploadedUrl = null;
        if(resp.success) {
          this.tagForm.reset();
          this.getTags();
        }
      });
    }
  }

  removeTag(id:number) {
    this._tagService.removeTag(id).then((resp:any) => {
      if(resp.success) {
        this.getTags();
      }
    });
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.uploadedUrl = reader.result;
      }
    }
  }

}

export interface TagFormObj {
  name:string,
  type:number,
}



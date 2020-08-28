import { Component, OnInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators} from '@angular/forms';
import { TagsService, Tag, TagType } from '../tags.service';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.css']
})
export class TagFormComponent implements OnInit {

  tagForm:FormGroup;
  entryTags:Tag[];
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
      ])
    });
  }

  getTags() {
    this._tagService.getTags(this.raceID,this.tagType).then((tags:any) => {
      this.entryTags = tags['tags'];
    });
  }

  addTag() {
    let formClean = this.tagForm.value as TagFormObj;
    console.log(this.tagForm);
    let isValid: Boolean = this.tagForm.valid;

    if(isValid && formClean.name != '') {
      formClean
      this._tagService.addTag(formClean).then((resp:any) =>{
        if(resp.success) {
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

}

export interface TagFormObj {
  name:string,
  type:number,
}



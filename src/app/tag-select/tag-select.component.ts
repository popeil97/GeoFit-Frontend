import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl,FormGroup, Validators} from '@angular/forms';
import { 
  TagsService 
} from '../services';
import {
  Tag,
  TagType,
} from '../interfaces';

@Component({
  selector: 'app-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent implements OnInit {

  tagSelectForm:FormGroup;
  selectedTag:Tag;
  @Input() raceID:number;
  @Input() tagType: TagType;
  @Input() hasAll: Boolean;
  @Input() title:string;
  @Output() emitState:EventEmitter<any> = new EventEmitter();
  tags:Tag[];

  noneTag = {id:-1,name:'None',type:TagType.ENTRY} as Tag;
  allTag = {id:0,name:'All',type:TagType.ENTRY} as Tag;

  constructor(
    private _tagService:TagsService
  ) { }

  ngOnInit() {
    this.tagSelectForm = new FormGroup({
      tag: new FormControl(this.noneTag,[
        Validators.required,
      ]),
    });

    console.log('IN TAG SELECT');

    this._tagService.getTags(this.raceID,this.tagType).then((resp:any) => {
      this.tags = resp['tags'];
    //   console.log('TAGS:',this.tags);

      this.tags.push(this.noneTag);

      if(this.hasAll) {
        this.tags.push(this.allTag);
      }
    });
  }

  onTagSelect(tag:Tag) {
    let callbackBody = {} as any
    callbackBody.success = true;
    callbackBody.data = {id:tag.id} as any;
    callbackBody.type = "TAG";
   //  console.log(tag);
    this.emitState.emit(callbackBody);
  }

}

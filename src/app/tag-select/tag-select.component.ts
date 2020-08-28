import { Component, OnInit, Input } from '@angular/core';
import { FormControl,FormGroup, Validators} from '@angular/forms';
import { Tag } from '../tags.service';

@Component({
  selector: 'app-tag-select',
  templateUrl: './tag-select.component.html',
  styleUrls: ['./tag-select.component.css']
})
export class TagSelectComponent implements OnInit {

  tagSelectForm:FormGroup;

  constructor() { }

  ngOnInit() {
    this.tagSelectForm = new FormGroup({
      tagID: new FormControl('',[
        Validators.required,
      ]),
    })
  }

  onTagSelect(tag:Tag) {

  }

}

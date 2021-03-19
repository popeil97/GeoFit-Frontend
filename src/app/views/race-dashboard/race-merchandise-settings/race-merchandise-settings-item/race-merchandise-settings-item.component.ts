import { Component, OnInit, Inject, NgModule, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ItemService } from '../../../../item.service';

import { isNumber, cannotBeEmptyString, isFormValid, requiredFileType } from '../../../../services';
import { ItemStates } from '../race-merchandise-settings.component';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-race-merchandise-settings-item',
  templateUrl: './race-merchandise-settings-item.component.html',
  styleUrls: [
    './race-merchandise-settings-item.component.css',
    '../../../../../styles/forms.css'
  ]
})
export class RaceMerchandiseSettingsItemComponent implements OnInit,OnDestroy {

  public initializing:boolean = true;
  public initialData:any = null;

  public form:FormGroup = null;
  public merchandiseImageURL:any = null;
  public merchandiseImageLoading:boolean = false;
  private merchandiseImageInput:any = null;
  private itemStateList:any = null;

  public checkingValidityOfSubmission:boolean = false;
  public validForm:Boolean = true;
  public updatingItem:boolean = false;
  public placeholders:any = {
    name:"ex. T-Shirt",
    description:"ex. A T-Shirt for participating in our race.",
    price:"ex. 5.00",
    sizes:"ex. Small, Medium, Large"
  }

  private formClean:any = null;

  constructor(
    private fb: FormBuilder,
    private _itemService:ItemService,

    public dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef : MatDialogRef<RaceMerchandiseSettingsItemComponent>,
  ) {
    this.itemStateList = Object.keys(ItemStates).reduce((accumulator,state_key)=>{
      if (isNaN(parseInt(state_key))) {
        accumulator.push({
          name:state_key,
          value:ItemStates[state_key]
        });
      }
      return accumulator;
    },[]);
  }

  ngOnInit() {
    this.initialData = (this.data.itemData!= null) ? this.data.itemData : {
      id:null,
      name:"",
      description:"",
      price:0,
      type:this.data.itemType,
      state:1,
      image:null,
      sizes:"",
    }
    this.initializeForm();
  }
  ngAfterViewInit() {
    this.merchandiseImageInput = document.getElementById("merchandiseItemImageInput");
    window.scrollTo(0,0);
  }
  ngOnDestroy() {
    this.form = null;
    this.initialData = null;
    this.merchandiseImageURL = null;
    this.merchandiseImageInput = null;
    this.itemStateList = null;
    this.formClean = null;
  }

  initializeForm() {
    this.merchandiseImageURL = this.initialData.image;
    this.form = this.fb.group({
      name:[this.initialData.name,Validators.compose([
        Validators.required,
        cannotBeEmptyString(),
      ])],
      description:[this.initialData.description,Validators.compose([
        Validators.required,
        cannotBeEmptyString(),
      ])],
      price:[this.initialData.price,Validators.compose([
        Validators.required,
        isNumber(),
        Validators.min(0),
      ])],
      type:[this.initialData.type,Validators.compose([
        Validators.required,
      ])],
      state:[this.initialData.state,Validators.compose([
        Validators.required,
      ])],
      image:[this.initialData.image_file,Validators.compose([
        requiredFileType(false, ['jpg','jpeg','png'])
      ])],
      sizes:[this.initialData.sizes],
    });
    this.initializing = false;
    this.checkingValidityOfSubmission = false;
    this.updatingItem = false;
    this.validForm = true;

    if (this.initialData.type == 1) {
      this.placeholders = {
        name:"ex. Registration Fee",
        description:"ex. To help support efforts to maintain the race, a nominal fee is required to participate.",
        price:"ex. 5.00",
        sizes:"(No sizes needed)"
      }
    }
  }
  resetForm(e:any) {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.initializeForm();
  }
  _isFormValid = () => {
    return isFormValid(this.form);
  }
  onFormSubmit(e:Event) {
    e.preventDefault();
    e.stopPropagation();

    this.checkingValidityOfSubmission = true;
    this.validForm = this._isFormValid();

    const keyToOriginalKey = (k:string) => {
      var original = null;
      switch(k) {
        case "id":
          original = "item_id";
          break;
        case "type":
          original = "item_type";
          break;
        case "state":
          original = "item_state";
          break;
        default:
          original = k;
      }
      return original;
    }
    const successResponse = (resp:any)=>{
      if (resp.success) {
        alert("Your item has been created or edited.");
        this.closeDialog(this.formClean);
      }
      else throw(new Error(resp.message));
    }
    const errorResponse = (error:any)=>{
      console.error(error);
      alert("A problem has occurred with your item creation or update.");
    }
    const finalResponse = ()=>{
      this.checkingValidityOfSubmission = false;
      this.updatingItem = false;
    }

    if (this.validForm) {
      // Find differences
      this.formClean = {}
      var itemValues = this.form.value;
      Object.keys(itemValues).forEach(key=>{
        var value =  (key == "image") ? this.merchandiseImageURL : itemValues[key];
        if (this.initialData.id == null || value != this.initialData[key]) this.formClean[keyToOriginalKey(key)] = value;
      });

      if (this.initialData.id != null) {
        // We're editing, so we'll only be tracking changes
        if (Object.keys(this.formClean).length == 0) {
          this.checkingValidityOfSubmission = false;
          return;
        }
        this.updatingItem = true;
        this._itemService.editItem(this.initialData.id,this.formClean).then(successResponse).catch(errorResponse).finally(finalResponse);
      }
      else {
        // We're creating, so we just map everything
        this.updatingItem = true;
        this._itemService.createItem(this.data.raceID,this.formClean).then(successResponse).catch(errorResponse).finally(finalResponse);
      }
    } else {
      this.checkingValidityOfSubmission = false;
    }
  }

  roundToCent() {
    const val = this.form.get('price').value;
    if (val == null) return;
    const newVal = val.toFixed(2);
    this.form.get('price').setValue(newVal);
  }

  selectMerchandiseFile() {
    this.merchandiseImageInput.click();
  }
  onSelectMerchandiseImageChange(e:any) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var imageInput = this.form.get('image');
    if (
      imageInput.invalid
      ||
      e.target.files == null
      ||
      (e.target.files && e.target.files.length == 0)
    ) {
      console.log("SOMETHING IS WRONG:",imageInput.errors, e.target.files==null,(e.target.files&&e.target.files.length==0));
      this.merchandiseImageURL = null;
      this.merchandiseImageLoading = false;
      return;
    }
    this.merchandiseImageLoading = true;
    let file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = (event) => {
      this.merchandiseImageURL = reader.result;
      this.merchandiseImageLoading = false;
    }
    reader.readAsDataURL(file);
  }
  cancelMerchandiseImage(e:any) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.merchandiseImageURL = this.initialData.image;
    this.merchandiseImageLoading = false;
    this.form.get('image').reset();
  }
  removeMerchandiseImage(e:any) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.merchandiseImageURL = this.initialData.image;
    this.merchandiseImageLoading = false;
    this.form.get('image').setValue(this.initialData.image);
  }

  closeDialog(passedFormData:any) {

    var item = passedFormData;
    item.itemIndex = this.initialData.itemIndex;

    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    
    //this.modalService.close(this.id);
    this.dialogRef.close(item);
  }

}
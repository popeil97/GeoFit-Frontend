import { Component, OnInit, Inject, NgModule, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { 
  ItemService,
  TucanValidators, 
} from '../../services';

import {
  ConfirmationPopupComponent,
} from '../confirmation-popup/confirmation-popup.component';

import {
  InactiveStateExplanationPopupComponent,
} from '../inactive-state-explanation-popup/inactive-state-explanation-popup.component';

import { 
  ItemState,
  ConfirmationData,
  Choice,
} from '../../interfaces';

@NgModule({
  imports:[MatDialogRef]
})

@Component({
  selector: 'app-race-merchandise-settings-item',
  templateUrl: './race-merchandise-settings-item.component.html',
  styleUrls: [
    './race-merchandise-settings-item.component.css',
    '../../../styles/forms.css'
  ]
})
export class RaceMerchandiseSettingsItemComponent implements OnInit,OnDestroy {

  public initializing:boolean = true;
  public initialData:any = null;

  public form:FormGroup = null;
  private formChangeSubscription:any = null;
  private formHasChanged:Boolean = false;

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
  private confirmationPopupData:ConfirmationData = {
    header:"Warning",
    prompt:"You've made changes to this form. Do you wish to discard changes and continue?",
    choices:[
      {
        text:"Discard",
        value:true,
        buttonColor:"red",
        textColor:"white",
      },
      {
        "text":"Cancel",
        value:false,
      }
    ] as Array<Choice>
  }

  private formClean:any = null;

  constructor(
    private fb: FormBuilder,
    private _itemService:ItemService,
    //private routerService:RouterService,

    public dialog : MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:any,
    public dialogRef : MatDialogRef<RaceMerchandiseSettingsItemComponent>,
  ) {
    this.dialogRef.disableClose= true;
    this.dialogRef.backdropClick().subscribe(()=>{
      const callback = (result:any):void => {
        if (result.value) this.closeDialog(null);
      }
      if (this.formHasChanged) {
        const d = this.dialog.open(ConfirmationPopupComponent,{
          panelClass:"DialogDefaultComponent",
          data:{confirmationData:this.confirmationPopupData}
        });
        d.afterClosed().subscribe(callback);
      } 
      else this.closeDialog(null);
    });
    this.itemStateList = Object.keys(ItemState).reduce((accumulator,state_key)=>{
      if (isNaN(parseInt(state_key))) {
        accumulator.push({
          name:state_key,
          value:ItemState[state_key]
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
    if (this.formChangeSubscription != null) {
      this.formChangeSubscription.unsubscribe();
      this.formChangeSubscription = null;
    }
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
        TucanValidators.cannotBeEmptyString(),
      ])],
      description:[this.initialData.description,Validators.compose([
        Validators.required,
        TucanValidators.cannotBeEmptyString(),
      ])],
      price:[this.initialData.price,Validators.compose([
        Validators.required,
        TucanValidators.isNumber(),
        Validators.min(0),
      ])],
      type:[this.initialData.type,Validators.compose([
        Validators.required,
      ])],
      state:[this.initialData.state,Validators.compose([
        Validators.required,
      ])],
      image:[this.initialData.image_file,Validators.compose([
        TucanValidators.requiredFileType(false, ['jpg','jpeg','png'])
      ])],
      sizes:[this.initialData.sizes],
    });
    this.formChangeSubscription = this.form.valueChanges.subscribe((values)=>{
      const changed = Object.keys(values).reduce((accumulator:Boolean,key:string)=>{
        const c = (key == "image")
          ? this.merchandiseImageURL != this.initialData.image_file
          : values[key] != this.initialData[key]
        return accumulator || c;
      },false);
      this.formHasChanged = changed;
    })

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
    return TucanValidators.isFormValid(this.form);
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

  /*
  setConfirmationPopupData = (values:any, submitting:Boolean = false):void => {
    // We first check any changes in the user's data compared to our initial data and send it to router service
    const changed = Object.keys(values).reduce((accumulator:Boolean,key:string)=>{
      const c = (key == "image")
        ? this.merchandiseImageURL != this.initialData.image_file
        : values[key] != this.initialData[key]
      return accumulator || c;
    },false);
    this.routerService.formHasChanged(changed);

    // There are several conditions on which we determine some popup data to appear:
    //  1) if we're involved with an entry item (aka type == 1), we are shown a warning if the expected outcome is that there are no active entries in the end
    //    There are some subconditions:
    //    1.1) if our list of active 
    
    if (values.type == 1 && this.data.activeEntryItems.length == 0 && parseInt(values.state) == 2) {
      let prompt = (submitting) 
        ? "A race requires at least one active entry item, even if the price is set to $0.00. Are you sure you wish to save this entry item as an inactive item?"
        : "A race requires at least one active entry item, even if the price is set to $0.00. Are you sure you wish to discard this entry item?"
      this.confirmationPopupData = {
        header:"No active entry items",
        prompt:"A race requires at least one active entry item, even if the price is set to $0.00. Are you sure you wish to discard this entry item?",
        choices:[
          { text:"Discard", value:true, buttonColor:"red", textColor:"white" },
          { text:"Cancel", value:false }
        ] as Array<Choice>
      } as ConfirmationData;
    }
  }
  */

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

  openItemStateExplanation = (e:any):void => {
    if (e.preventDefault) e.preventDefault();
    if (e.stopPropagation) e.stopPropagation();
    this.dialog.open(InactiveStateExplanationPopupComponent,{
      panelClass:"DialogDefaultContainer"
    });
  }

  closeDialog = (passedFormData:any):void => {

    var item = passedFormData;
    if (item != null) item.itemIndex = this.initialData.itemIndex;

    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    
    this.dialogRef.close(item);
  }

}
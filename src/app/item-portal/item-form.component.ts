import { Component, Input, OnChanges, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { ItemService } from '../item.service';
import { Item, ItemType } from '../swag.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit,OnChanges {
  
  @Input() raceID:number = 24;
  @Input() itemID:number;
  @Output() callback:EventEmitter<any> = new EventEmitter();
  itemForm:FormGroup;
  submitted:Boolean;
  loading:Boolean;
  uploadedUrl:any;

  itemTypes = [
      {name:"Entry",value:ItemType.ENTRY},
      {name:"Entry + Merchandise",value:ItemType.ENTRYANDSWAG},
      {name: "Merchandise", value:ItemType.SWAG}
  ];

  constructor(private _itemService:ItemService, private formBuilder: FormBuilder) { }

    ngOnChanges(changes: SimpleChanges): void {
        for(const propName in changes) {
            if(changes.hasOwnProperty(propName)) {
      
              switch(propName) {
                case 'itemID':
                  console.log('HIT NG CHANGES');
                  if(changes.itemID.currentValue != undefined) {
                    
                    this.initForm();
      
                  }
              }
            }
          }
    }

  ngOnInit() {

    this.itemForm = this.formBuilder.group({
        name: ['',Validators.required],
        description: ['',Validators.required],
        price:[0.00,Validators.required],
        item_type:['',Validators.required],
        sizes: ['',Validators.nullValidator],
        image: new FormControl(''),
    });

  }

  initForm() {
      // initialize form by calling API to get item details from itemID
      // then fill form

      this._itemService.getItemByID(this.itemID).then((resp) => {
          let item = resp['item'] as Item;

          // fill form

          let sizes = '';
          for(var i = 0; i < item.sizes.length; i++) {
              sizes += item.sizes[i];

              if(i != item.sizes.length-1) {
                  sizes += ',';
              }
          }

          this.itemForm = this.formBuilder.group({
            name: [item.name,Validators.required],
            description: [item.description,Validators.required],
            price:[item.price,Validators.required],
            item_type:[item.type,Validators.required],
            sizes: [sizes,Validators.nullValidator],
            image: new FormControl(''),
        });

        // get item type index
        let itemTypeIndex = 0;
        for(var i = 0; i < this.itemTypes.length; i++) {
            if(this.itemTypes[i].value == item.type) {
                itemTypeIndex = i;
                break;
            }
        }

        // set item type dropdown
        let itemSelect = document.getElementById('itemTypeSelect') as any;
        itemSelect.selectedIndex = itemTypeIndex;

      })

  }

  // convenience getter for easy access to form fields
  get controls() { return this.itemForm.controls; }

  changeItemType(itemType:any) {
    console.log(itemType);
    this.itemForm.get('item_type').setValue(itemType, {
      onlySelf: true
    })
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


  submitForm() {
      this.submitted = true;

    //   check if form is valid
      if(this.itemForm.invalid) {return;}

      this.loading = true;

      let cleanForm = this.itemForm.value;
      cleanForm['item_type'] = cleanForm['item_type'].value;
      if(this.uploadedUrl) {
        cleanForm['image'] = this.uploadedUrl;
      }
      else {
        cleanForm['image'] = null;
      }

      console.log("CLEARN FORM: ",cleanForm);

      // submit item form
      this._itemService.createItem(this.raceID,cleanForm).then((resp) => {
          console.log('CREATE ITEM RESP:',resp);
        if(resp['success']) {
            console.log('successfully created item!');
            this.callback.emit(); // tell dialog to close
        }
        this.loading = false;
        
      });

      this.submitted = false;
  }

}



import { Component, Input, OnChanges, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormControl } from '@angular/forms';
import { 
  ItemService 
} from '../services';
import { 
  Item, 
  ItemType
} from '../interfaces';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit,OnChanges {
  
  @Input() raceID:number = 24;
  @Input() itemID:number;
  @Input() isEdit: boolean = false;
  @Output() callback:EventEmitter<any> = new EventEmitter();

  itemForm:FormGroup;
  submitted:Boolean;
  loading:Boolean;
  uploadedUrl:any;
  item:Item;

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
        console.log("ITEM FROM GET ITEM BY ID:",resp);
          this.item = resp['item'] as Item;

          // fill form

          let sizes = '';
          if(this.item.sizes != null) {
            for(var i = 0; i < this.item.sizes.length; i++) {
              sizes += this.item.sizes[i];

              if(i != this.item.sizes.length-1) {
                  sizes += ',';
              }
            }
          }
          

          this.itemForm = this.formBuilder.group({
            name: [this.item.name,Validators.required],
            description: [this.item.description,Validators.required],
            price:[this.item.price,Validators.required],
            item_type:[this.item.type,Validators.required],
            sizes: [sizes,Validators.nullValidator],
            image: new FormControl(''),
        });

        // get item type index
        let itemTypeIndex = 0;
        for(var i = 0; i < this.itemTypes.length; i++) {
            if(this.itemTypes[i].value == this.item.type) {
                itemTypeIndex = i;
                break;
            }
        }

        // set item type dropdown
        // let itemSelect = document.getElementById('itemTypeSelect') as any;
        // itemSelect.selectedIndex = itemTypeIndex;

        this.itemForm.controls.item_type.setValue(this.itemTypes[itemTypeIndex]);

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

      if(this.isEdit) {
          this._itemService.editItem(this.item.id,cleanForm).then((resp) => {
            if(resp['success']) {
              console.log('successfully created item!');
              this.callback.emit(); // tell dialog to close
            }
          });
      }

      else {
        this._itemService.createItem(this.raceID,cleanForm).then((resp) => {
          console.log('CREATE ITEM RESP:',resp);
        if(resp['success']) {
            console.log('successfully created item!');
            this.callback.emit(); // tell dialog to close
        }
        this.loading = false;
        
      });

      let fakeForm = {
        'name':'TestyBOIII',
        'description': 'ANIME TIBBIES',
        'startDate':'01/20/2020',
        'endDate':'02/20/2020',
        'startLoc':'REEEE',
        'endLoc':'RE-ROO',
        'raceImage':this.uploadedUrl
      };

      this._raceService.updateRaceAbout(fakeForm,this.raceID).then((resp) => {
        console.log('RESP FROM RACE ABOUT UPDATE: ', resp);
      });
      }
      

      this.submitted = false;
  }

}



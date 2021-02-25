import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPortalComponent } from './item-portal.component';

describe('ItemPortalComponent', () => {
  let component: ItemPortalComponent;
  let fixture: ComponentFixture<ItemPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

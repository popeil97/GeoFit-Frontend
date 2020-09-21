import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwagItemComponent } from './swag-item.component';

describe('SwagItemComponent', () => {
  let component: SwagItemComponent;
  let fixture: ComponentFixture<SwagItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwagItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwagItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

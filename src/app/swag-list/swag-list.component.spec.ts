import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwagListComponent } from './swag-list.component';

describe('SwagListComponent', () => {
  let component: SwagListComponent;
  let fixture: ComponentFixture<SwagListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwagListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

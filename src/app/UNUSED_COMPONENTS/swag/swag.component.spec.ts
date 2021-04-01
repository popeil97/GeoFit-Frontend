import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwagComponent } from './swag.component';

describe('SwagComponent', () => {
  let component: SwagComponent;
  let fixture: ComponentFixture<SwagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

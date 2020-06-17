import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StravauthComponent } from './stravauth.component';

describe('StravauthComponent', () => {
  let component: StravauthComponent;
  let fixture: ComponentFixture<StravauthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StravauthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StravauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

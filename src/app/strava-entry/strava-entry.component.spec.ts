import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StravaEntryComponent } from './strava-entry.component';

describe('ActivitiesMenuComponent', () => {
  let component: StravaEntryComponent;
  let fixture: ComponentFixture<StravaEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StravaEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StravaEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

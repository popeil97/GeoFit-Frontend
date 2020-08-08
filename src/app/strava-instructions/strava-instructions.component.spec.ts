import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StravaInstructionsComponent } from './strava-instructions.component';

describe('StravaInstructionsComponent', () => {
  let component: StravaInstructionsComponent;
  let fixture: ComponentFixture<StravaInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StravaInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StravaInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

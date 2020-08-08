import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDayComponent } from './race-day.component';

describe('RaceDayComponent', () => {
  let component: RaceDayComponent;
  let fixture: ComponentFixture<RaceDayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceDayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

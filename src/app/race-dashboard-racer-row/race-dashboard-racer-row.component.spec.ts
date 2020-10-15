import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDashboardRacerRowComponent } from './race-dashboard-racer-row.component';

describe('RaceDashboardRacerRowComponent', () => {
  let component: RaceDashboardRacerRowComponent;
  let fixture: ComponentFixture<RaceDashboardRacerRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceDashboardRacerRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceDashboardRacerRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

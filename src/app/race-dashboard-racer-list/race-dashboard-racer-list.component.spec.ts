import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceDashboardRacerListComponent } from './race-dashboard-racer-list.component';

describe('RaceDashboardRacerListComponent', () => {
  let component: RaceDashboardRacerListComponent;
  let fixture: ComponentFixture<RaceDashboardRacerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceDashboardRacerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceDashboardRacerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

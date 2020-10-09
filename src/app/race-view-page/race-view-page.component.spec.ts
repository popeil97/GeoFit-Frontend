import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceViewPageComponent } from './race-view-page.component';

describe('RaceViewPageComponent', () => {
  let component: RaceViewPageComponent;
  let fixture: ComponentFixture<RaceViewPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceViewPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

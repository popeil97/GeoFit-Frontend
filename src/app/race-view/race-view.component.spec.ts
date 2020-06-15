import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceViewComponent } from './race-view.component';

describe('RaceViewComponent', () => {
  let component: RaceViewComponent;
  let fixture: ComponentFixture<RaceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

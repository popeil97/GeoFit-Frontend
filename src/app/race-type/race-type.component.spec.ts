import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceTypeComponent } from './race-type.component';

describe('RaceTypeComponent', () => {
  let component: RaceTypeComponent;
  let fixture: ComponentFixture<RaceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

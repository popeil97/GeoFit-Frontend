import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForRaceCreatorsComponent } from './for-race-creators.component';

describe('ForRaceCreatorsComponent', () => {
  let component: ForRaceCreatorsComponent;
  let fixture: ComponentFixture<ForRaceCreatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForRaceCreatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForRaceCreatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

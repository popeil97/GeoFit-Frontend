import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceBasicsComponent } from './race-basics.component';

describe('RaceBasicsComponent', () => {
  let component: RaceBasicsComponent;
  let fixture: ComponentFixture<RaceBasicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceBasicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceBasicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

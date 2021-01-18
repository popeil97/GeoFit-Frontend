import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForRacersComponent } from './for-racers.component';

describe('ForRacersComponent', () => {
  let component: ForRacersComponent;
  let fixture: ComponentFixture<ForRacersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForRacersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForRacersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

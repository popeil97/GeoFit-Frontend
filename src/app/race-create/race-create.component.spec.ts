import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceCreateComponent } from './race-create.component';

describe('RaceCreateComponent', () => {
  let component: RaceCreateComponent;
  let fixture: ComponentFixture<RaceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

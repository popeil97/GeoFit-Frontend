import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceAboutComponent } from './race-about.component';

describe('RaceAboutComponent', () => {
  let component: RaceAboutComponent;
  let fixture: ComponentFixture<RaceAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

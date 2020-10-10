import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceAboutPageComponent } from './race-about-page.component';

describe('RaceAboutPageComponent', () => {
  let component: RaceAboutPageComponent;
  let fixture: ComponentFixture<RaceAboutPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceAboutPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceAboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

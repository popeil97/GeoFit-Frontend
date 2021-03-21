import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTucanComponent } from './about-tucan.component';

describe('AboutTucanComponent', () => {
  let component: AboutTucanComponent;
  let fixture: ComponentFixture<AboutTucanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTucanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTucanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTucanPageComponent } from './about-tucan-page.component';

describe('AboutTucanPageComponent', () => {
  let component: AboutTucanPageComponent;
  let fixture: ComponentFixture<AboutTucanPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTucanPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTucanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

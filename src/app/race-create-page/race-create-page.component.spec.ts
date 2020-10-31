import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceCreatePageComponent } from './race-create-page.component';

describe('RaceCreatePageComponent', () => {
  let component: RaceCreatePageComponent;
  let fixture: ComponentFixture<RaceCreatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceCreatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

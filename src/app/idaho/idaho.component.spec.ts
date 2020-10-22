import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdahoComponent } from './idaho.component';

describe('IdahoComponent', () => {
  let component: IdahoComponent;
  let fixture: ComponentFixture<IdahoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdahoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdahoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

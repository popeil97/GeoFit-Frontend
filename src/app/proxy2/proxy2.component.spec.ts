import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Proxy2Component } from './proxy2.component';

describe('Proxy2Component', () => {
  let component: Proxy2Component;
  let fixture: ComponentFixture<Proxy2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Proxy2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Proxy2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

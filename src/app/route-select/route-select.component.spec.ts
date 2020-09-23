import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteSelectComponent } from './route-select.component';

describe('RouteSelectComponent', () => {
  let component: RouteSelectComponent;
  let fixture: ComponentFixture<RouteSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

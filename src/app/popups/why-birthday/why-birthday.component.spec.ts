import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyBirthdayComponent } from './why-birthday.component';

describe('WhyBirthdayComponent', () => {
  let component: WhyBirthdayComponent;
  let fixture: ComponentFixture<WhyBirthdayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyBirthdayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyBirthdayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

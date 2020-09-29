import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyInfoComponent } from './why-info.component';

describe('WhyInfoComponent', () => {
  let component: WhyInfoComponent;
  let fixture: ComponentFixture<WhyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

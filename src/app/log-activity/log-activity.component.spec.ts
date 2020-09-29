import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogActivityComponent } from './log-activity.component';

describe('LogActivityComponent', () => {
  let component: LogActivityComponent;
  let fixture: ComponentFixture<LogActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JumpToComponent } from './jump-to.component';

describe('JumpToComponent', () => {
  let component: JumpToComponent;
  let fixture: ComponentFixture<JumpToComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JumpToComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JumpToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInstructionsComponent } from './team-instructions.component';

describe('TeamInstructionsComponent', () => {
  let component: TeamInstructionsComponent;
  let fixture: ComponentFixture<TeamInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

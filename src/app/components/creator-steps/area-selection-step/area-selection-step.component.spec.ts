import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSelectionStepComponent } from './area-selection-step.component';

describe('AreaSelectionStepComponent', () => {
  let component: AreaSelectionStepComponent;
  let fixture: ComponentFixture<AreaSelectionStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSelectionStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSelectionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

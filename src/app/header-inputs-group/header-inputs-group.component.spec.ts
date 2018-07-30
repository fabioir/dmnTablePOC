import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInputsGroupComponent } from './header-inputs-group.component';

describe('HeaderInputsGroupComponent', () => {
  let component: HeaderInputsGroupComponent;
  let fixture: ComponentFixture<HeaderInputsGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderInputsGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInputsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

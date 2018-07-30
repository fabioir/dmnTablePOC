import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInputComponent } from './header-input.component';

describe('HeaderInputComponent', () => {
  let component: HeaderInputComponent;
  let fixture: ComponentFixture<HeaderInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

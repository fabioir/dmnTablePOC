import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewXmlComponent } from './view-xml.component';

describe('ViewXmlComponent', () => {
  let component: ViewXmlComponent;
  let fixture: ComponentFixture<ViewXmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewXmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewXmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

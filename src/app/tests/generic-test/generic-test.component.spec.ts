import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTestComponent } from './generic-test.component';

describe('GenericTestComponent', () => {
  let component: GenericTestComponent;
  let fixture: ComponentFixture<GenericTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

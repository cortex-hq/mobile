import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTestComponent } from './balance-test.component';

describe('BalanceTestComponent', () => {
  let component: BalanceTestComponent;
  let fixture: ComponentFixture<BalanceTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BalanceTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

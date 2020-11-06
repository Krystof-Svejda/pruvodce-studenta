import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPeriodsComponent } from './admin-periods.component';

describe('AdminQuartersComponent', () => {
  let component: AdminPeriodsComponent;
  let fixture: ComponentFixture<AdminPeriodsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPeriodsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

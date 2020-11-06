import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreditsComponent } from './admin-credits.component';

describe('AdminCreditsComponent', () => {
  let component: AdminCreditsComponent;
  let fixture: ComponentFixture<AdminCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

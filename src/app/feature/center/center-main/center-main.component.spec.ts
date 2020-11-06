import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterMainComponent } from './center-main.component';

describe('CenterMainComponent', () => {
  let component: CenterMainComponent;
  let fixture: ComponentFixture<CenterMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

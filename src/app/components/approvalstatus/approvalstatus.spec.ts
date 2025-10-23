import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Approvalstatus } from './approvalstatus';

describe('Approvalstatus', () => {
  let component: Approvalstatus;
  let fixture: ComponentFixture<Approvalstatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Approvalstatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Approvalstatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registrationfailed } from './registrationfailed';

describe('Registrationfailed', () => {
  let component: Registrationfailed;
  let fixture: ComponentFixture<Registrationfailed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registrationfailed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registrationfailed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

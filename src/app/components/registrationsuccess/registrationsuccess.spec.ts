import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Registrationsuccess } from './registrationsuccess';

describe('Registrationsuccess', () => {
  let component: Registrationsuccess;
  let fixture: ComponentFixture<Registrationsuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Registrationsuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Registrationsuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

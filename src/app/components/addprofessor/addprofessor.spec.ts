import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addprofessor } from './addprofessor';

describe('Addprofessor', () => {
  let component: Addprofessor;
  let fixture: ComponentFixture<Addprofessor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addprofessor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addprofessor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

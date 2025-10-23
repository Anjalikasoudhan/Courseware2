import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Professorprofile } from './professorprofile';

describe('Professorprofile', () => {
  let component: Professorprofile;
  let fixture: ComponentFixture<Professorprofile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Professorprofile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Professorprofile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

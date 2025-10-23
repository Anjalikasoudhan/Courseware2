import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Professorlist } from './professorlist';

describe('Professorlist', () => {
  let component: Professorlist;
  let fixture: ComponentFixture<Professorlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Professorlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Professorlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

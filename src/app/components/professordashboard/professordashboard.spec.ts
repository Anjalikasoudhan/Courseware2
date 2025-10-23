import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Professordashboard } from './professordashboard';

describe('Professordashboard', () => {
  let component: Professordashboard;
  let fixture: ComponentFixture<Professordashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Professordashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Professordashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fullcourse } from './fullcourse';

describe('Fullcourse', () => {
  let component: Fullcourse;
  let fixture: ComponentFixture<Fullcourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fullcourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fullcourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

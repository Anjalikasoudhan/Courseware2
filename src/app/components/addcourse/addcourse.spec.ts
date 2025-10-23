import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addcourse } from './addcourse';

describe('Addcourse', () => {
  let component: Addcourse;
  let fixture: ComponentFixture<Addcourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addcourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addcourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

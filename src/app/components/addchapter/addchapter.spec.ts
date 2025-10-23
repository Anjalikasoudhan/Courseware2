import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addchapter } from './addchapter';

describe('Addchapter', () => {
  let component: Addchapter;
  let fixture: ComponentFixture<Addchapter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addchapter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addchapter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

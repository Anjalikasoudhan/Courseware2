import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mywishlist } from './mywishlist';

describe('Mywishlist', () => {
  let component: Mywishlist;
  let fixture: ComponentFixture<Mywishlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mywishlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mywishlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerLayout } from './inner-layout';

describe('InnerLayout', () => {
  let component: InnerLayout;
  let fixture: ComponentFixture<InnerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

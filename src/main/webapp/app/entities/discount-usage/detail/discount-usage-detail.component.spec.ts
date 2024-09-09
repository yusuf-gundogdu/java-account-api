import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { DiscountUsageDetailComponent } from './discount-usage-detail.component';

describe('DiscountUsage Management Detail Component', () => {
  let comp: DiscountUsageDetailComponent;
  let fixture: ComponentFixture<DiscountUsageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountUsageDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./discount-usage-detail.component').then(m => m.DiscountUsageDetailComponent),
              resolve: { discountUsage: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(DiscountUsageDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountUsageDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load discountUsage on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', DiscountUsageDetailComponent);

      // THEN
      expect(instance.discountUsage()).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});

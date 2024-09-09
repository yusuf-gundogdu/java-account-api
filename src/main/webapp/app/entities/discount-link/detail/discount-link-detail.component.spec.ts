import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { DiscountLinkDetailComponent } from './discount-link-detail.component';

describe('DiscountLink Management Detail Component', () => {
  let comp: DiscountLinkDetailComponent;
  let fixture: ComponentFixture<DiscountLinkDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountLinkDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./discount-link-detail.component').then(m => m.DiscountLinkDetailComponent),
              resolve: { discountLink: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(DiscountLinkDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountLinkDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load discountLink on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', DiscountLinkDetailComponent);

      // THEN
      expect(instance.discountLink()).toEqual(expect.objectContaining({ id: 'ABC' }));
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

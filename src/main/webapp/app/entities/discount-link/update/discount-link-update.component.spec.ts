import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IDiscountUsage } from 'app/entities/discount-usage/discount-usage.model';
import { DiscountUsageService } from 'app/entities/discount-usage/service/discount-usage.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { IDiscountLink } from '../discount-link.model';
import { DiscountLinkService } from '../service/discount-link.service';
import { DiscountLinkFormService } from './discount-link-form.service';

import { DiscountLinkUpdateComponent } from './discount-link-update.component';

describe('DiscountLink Management Update Component', () => {
  let comp: DiscountLinkUpdateComponent;
  let fixture: ComponentFixture<DiscountLinkUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let discountLinkFormService: DiscountLinkFormService;
  let discountLinkService: DiscountLinkService;
  let discountUsageService: DiscountUsageService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DiscountLinkUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DiscountLinkUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscountLinkUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    discountLinkFormService = TestBed.inject(DiscountLinkFormService);
    discountLinkService = TestBed.inject(DiscountLinkService);
    discountUsageService = TestBed.inject(DiscountUsageService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call DiscountUsage query and add missing value', () => {
      const discountLink: IDiscountLink = { id: 'CBA' };
      const discountUsage: IDiscountUsage = { id: '50f25834-792a-4a06-a363-63306f2380a2' };
      discountLink.discountUsage = discountUsage;

      const discountUsageCollection: IDiscountUsage[] = [{ id: 'f171107e-7cb5-490d-9ff3-f6f934736029' }];
      jest.spyOn(discountUsageService, 'query').mockReturnValue(of(new HttpResponse({ body: discountUsageCollection })));
      const additionalDiscountUsages = [discountUsage];
      const expectedCollection: IDiscountUsage[] = [...additionalDiscountUsages, ...discountUsageCollection];
      jest.spyOn(discountUsageService, 'addDiscountUsageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ discountLink });
      comp.ngOnInit();

      expect(discountUsageService.query).toHaveBeenCalled();
      expect(discountUsageService.addDiscountUsageToCollectionIfMissing).toHaveBeenCalledWith(
        discountUsageCollection,
        ...additionalDiscountUsages.map(expect.objectContaining),
      );
      expect(comp.discountUsagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Company query and add missing value', () => {
      const discountLink: IDiscountLink = { id: 'CBA' };
      const company: ICompany = { id: 'b0424a5d-96e4-4e8e-b6e5-a9d6c99a6ff0' };
      discountLink.company = company;

      const companyCollection: ICompany[] = [{ id: 'f51a5d07-54af-40e4-a81e-ac20f414eced' }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ discountLink });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining),
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const discountLink: IDiscountLink = { id: 'CBA' };
      const discountUsage: IDiscountUsage = { id: 'f8e74a30-62f5-4165-9908-f592a2727656' };
      discountLink.discountUsage = discountUsage;
      const company: ICompany = { id: '138409a5-b174-42a1-9b78-9363ee09e2a0' };
      discountLink.company = company;

      activatedRoute.data = of({ discountLink });
      comp.ngOnInit();

      expect(comp.discountUsagesSharedCollection).toContain(discountUsage);
      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.discountLink).toEqual(discountLink);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscountLink>>();
      const discountLink = { id: 'ABC' };
      jest.spyOn(discountLinkFormService, 'getDiscountLink').mockReturnValue(discountLink);
      jest.spyOn(discountLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discountLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discountLink }));
      saveSubject.complete();

      // THEN
      expect(discountLinkFormService.getDiscountLink).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(discountLinkService.update).toHaveBeenCalledWith(expect.objectContaining(discountLink));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscountLink>>();
      const discountLink = { id: 'ABC' };
      jest.spyOn(discountLinkFormService, 'getDiscountLink').mockReturnValue({ id: null });
      jest.spyOn(discountLinkService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discountLink: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discountLink }));
      saveSubject.complete();

      // THEN
      expect(discountLinkFormService.getDiscountLink).toHaveBeenCalled();
      expect(discountLinkService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscountLink>>();
      const discountLink = { id: 'ABC' };
      jest.spyOn(discountLinkService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discountLink });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(discountLinkService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDiscountUsage', () => {
      it('Should forward to discountUsageService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(discountUsageService, 'compareDiscountUsage');
        comp.compareDiscountUsage(entity, entity2);
        expect(discountUsageService.compareDiscountUsage).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCompany', () => {
      it('Should forward to companyService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(companyService, 'compareCompany');
        comp.compareCompany(entity, entity2);
        expect(companyService.compareCompany).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

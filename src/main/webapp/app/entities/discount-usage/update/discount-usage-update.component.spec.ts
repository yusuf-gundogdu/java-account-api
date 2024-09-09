import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { DiscountUsageService } from '../service/discount-usage.service';
import { IDiscountUsage } from '../discount-usage.model';
import { DiscountUsageFormService } from './discount-usage-form.service';

import { DiscountUsageUpdateComponent } from './discount-usage-update.component';

describe('DiscountUsage Management Update Component', () => {
  let comp: DiscountUsageUpdateComponent;
  let fixture: ComponentFixture<DiscountUsageUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let discountUsageFormService: DiscountUsageFormService;
  let discountUsageService: DiscountUsageService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DiscountUsageUpdateComponent],
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
      .overrideTemplate(DiscountUsageUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscountUsageUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    discountUsageFormService = TestBed.inject(DiscountUsageFormService);
    discountUsageService = TestBed.inject(DiscountUsageService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const discountUsage: IDiscountUsage = { id: 'CBA' };
      const user: IUser = { id: 14002 };
      discountUsage.user = user;

      const userCollection: IUser[] = [{ id: 20601 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ discountUsage });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const discountUsage: IDiscountUsage = { id: 'CBA' };
      const user: IUser = { id: 22831 };
      discountUsage.user = user;

      activatedRoute.data = of({ discountUsage });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.discountUsage).toEqual(discountUsage);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscountUsage>>();
      const discountUsage = { id: 'ABC' };
      jest.spyOn(discountUsageFormService, 'getDiscountUsage').mockReturnValue(discountUsage);
      jest.spyOn(discountUsageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discountUsage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discountUsage }));
      saveSubject.complete();

      // THEN
      expect(discountUsageFormService.getDiscountUsage).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(discountUsageService.update).toHaveBeenCalledWith(expect.objectContaining(discountUsage));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscountUsage>>();
      const discountUsage = { id: 'ABC' };
      jest.spyOn(discountUsageFormService, 'getDiscountUsage').mockReturnValue({ id: null });
      jest.spyOn(discountUsageService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discountUsage: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discountUsage }));
      saveSubject.complete();

      // THEN
      expect(discountUsageFormService.getDiscountUsage).toHaveBeenCalled();
      expect(discountUsageService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDiscountUsage>>();
      const discountUsage = { id: 'ABC' };
      jest.spyOn(discountUsageService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discountUsage });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(discountUsageService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

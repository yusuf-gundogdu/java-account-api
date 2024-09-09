import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { IUserRating } from '../user-rating.model';
import { UserRatingService } from '../service/user-rating.service';
import { UserRatingFormService } from './user-rating-form.service';

import { UserRatingUpdateComponent } from './user-rating-update.component';

describe('UserRating Management Update Component', () => {
  let comp: UserRatingUpdateComponent;
  let fixture: ComponentFixture<UserRatingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userRatingFormService: UserRatingFormService;
  let userRatingService: UserRatingService;
  let userService: UserService;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserRatingUpdateComponent],
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
      .overrideTemplate(UserRatingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserRatingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userRatingFormService = TestBed.inject(UserRatingFormService);
    userRatingService = TestBed.inject(UserRatingService);
    userService = TestBed.inject(UserService);
    companyService = TestBed.inject(CompanyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userRating: IUserRating = { id: 'CBA' };
      const user: IUser = { id: 1542 };
      userRating.user = user;

      const userCollection: IUser[] = [{ id: 31872 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userRating });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Company query and add missing value', () => {
      const userRating: IUserRating = { id: 'CBA' };
      const company: ICompany = { id: 'c838b6f0-dbce-4fd9-8365-34a6adc58bbc' };
      userRating.company = company;

      const companyCollection: ICompany[] = [{ id: '740f2504-2de1-4e97-b127-1b0c7bf90041' }];
      jest.spyOn(companyService, 'query').mockReturnValue(of(new HttpResponse({ body: companyCollection })));
      const additionalCompanies = [company];
      const expectedCollection: ICompany[] = [...additionalCompanies, ...companyCollection];
      jest.spyOn(companyService, 'addCompanyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userRating });
      comp.ngOnInit();

      expect(companyService.query).toHaveBeenCalled();
      expect(companyService.addCompanyToCollectionIfMissing).toHaveBeenCalledWith(
        companyCollection,
        ...additionalCompanies.map(expect.objectContaining),
      );
      expect(comp.companiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userRating: IUserRating = { id: 'CBA' };
      const user: IUser = { id: 21969 };
      userRating.user = user;
      const company: ICompany = { id: '4147a801-09cd-4856-998a-d11f2821c42a' };
      userRating.company = company;

      activatedRoute.data = of({ userRating });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.companiesSharedCollection).toContain(company);
      expect(comp.userRating).toEqual(userRating);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserRating>>();
      const userRating = { id: 'ABC' };
      jest.spyOn(userRatingFormService, 'getUserRating').mockReturnValue(userRating);
      jest.spyOn(userRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userRating }));
      saveSubject.complete();

      // THEN
      expect(userRatingFormService.getUserRating).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userRatingService.update).toHaveBeenCalledWith(expect.objectContaining(userRating));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserRating>>();
      const userRating = { id: 'ABC' };
      jest.spyOn(userRatingFormService, 'getUserRating').mockReturnValue({ id: null });
      jest.spyOn(userRatingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userRating: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userRating }));
      saveSubject.complete();

      // THEN
      expect(userRatingFormService.getUserRating).toHaveBeenCalled();
      expect(userRatingService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserRating>>();
      const userRating = { id: 'ABC' };
      jest.spyOn(userRatingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userRating });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userRatingService.update).toHaveBeenCalled();
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

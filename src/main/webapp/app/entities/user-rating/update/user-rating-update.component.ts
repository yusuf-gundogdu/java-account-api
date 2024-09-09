import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { UserRatingService } from '../service/user-rating.service';
import { IUserRating } from '../user-rating.model';
import { UserRatingFormGroup, UserRatingFormService } from './user-rating-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-rating-update',
  templateUrl: './user-rating-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserRatingUpdateComponent implements OnInit {
  isSaving = false;
  userRating: IUserRating | null = null;

  usersSharedCollection: IUser[] = [];
  companiesSharedCollection: ICompany[] = [];

  protected userRatingService = inject(UserRatingService);
  protected userRatingFormService = inject(UserRatingFormService);
  protected userService = inject(UserService);
  protected companyService = inject(CompanyService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UserRatingFormGroup = this.userRatingFormService.createUserRatingFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userRating }) => {
      this.userRating = userRating;
      if (userRating) {
        this.updateForm(userRating);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userRating = this.userRatingFormService.getUserRating(this.editForm);
    if (userRating.id !== null) {
      this.subscribeToSaveResponse(this.userRatingService.update(userRating));
    } else {
      this.subscribeToSaveResponse(this.userRatingService.create(userRating));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserRating>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userRating: IUserRating): void {
    this.userRating = userRating;
    this.userRatingFormService.resetForm(this.editForm, userRating);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userRating.user);
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      userRating.company,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userRating?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) => this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.userRating?.company)),
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}

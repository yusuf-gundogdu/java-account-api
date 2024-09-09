import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IDiscountUsage } from '../discount-usage.model';
import { DiscountUsageService } from '../service/discount-usage.service';
import { DiscountUsageFormGroup, DiscountUsageFormService } from './discount-usage-form.service';

@Component({
  standalone: true,
  selector: 'jhi-discount-usage-update',
  templateUrl: './discount-usage-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DiscountUsageUpdateComponent implements OnInit {
  isSaving = false;
  discountUsage: IDiscountUsage | null = null;

  usersSharedCollection: IUser[] = [];

  protected discountUsageService = inject(DiscountUsageService);
  protected discountUsageFormService = inject(DiscountUsageFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DiscountUsageFormGroup = this.discountUsageFormService.createDiscountUsageFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discountUsage }) => {
      this.discountUsage = discountUsage;
      if (discountUsage) {
        this.updateForm(discountUsage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discountUsage = this.discountUsageFormService.getDiscountUsage(this.editForm);
    if (discountUsage.id !== null) {
      this.subscribeToSaveResponse(this.discountUsageService.update(discountUsage));
    } else {
      this.subscribeToSaveResponse(this.discountUsageService.create(discountUsage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscountUsage>>): void {
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

  protected updateForm(discountUsage: IDiscountUsage): void {
    this.discountUsage = discountUsage;
    this.discountUsageFormService.resetForm(this.editForm, discountUsage);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, discountUsage.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.discountUsage?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}

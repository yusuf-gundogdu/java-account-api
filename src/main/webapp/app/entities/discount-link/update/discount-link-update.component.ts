import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDiscountUsage } from 'app/entities/discount-usage/discount-usage.model';
import { DiscountUsageService } from 'app/entities/discount-usage/service/discount-usage.service';
import { ICompany } from 'app/entities/company/company.model';
import { CompanyService } from 'app/entities/company/service/company.service';
import { DiscountLinkService } from '../service/discount-link.service';
import { IDiscountLink } from '../discount-link.model';
import { DiscountLinkFormGroup, DiscountLinkFormService } from './discount-link-form.service';

@Component({
  standalone: true,
  selector: 'jhi-discount-link-update',
  templateUrl: './discount-link-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DiscountLinkUpdateComponent implements OnInit {
  isSaving = false;
  discountLink: IDiscountLink | null = null;

  discountUsagesSharedCollection: IDiscountUsage[] = [];
  companiesSharedCollection: ICompany[] = [];

  protected discountLinkService = inject(DiscountLinkService);
  protected discountLinkFormService = inject(DiscountLinkFormService);
  protected discountUsageService = inject(DiscountUsageService);
  protected companyService = inject(CompanyService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DiscountLinkFormGroup = this.discountLinkFormService.createDiscountLinkFormGroup();

  compareDiscountUsage = (o1: IDiscountUsage | null, o2: IDiscountUsage | null): boolean =>
    this.discountUsageService.compareDiscountUsage(o1, o2);

  compareCompany = (o1: ICompany | null, o2: ICompany | null): boolean => this.companyService.compareCompany(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discountLink }) => {
      this.discountLink = discountLink;
      if (discountLink) {
        this.updateForm(discountLink);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discountLink = this.discountLinkFormService.getDiscountLink(this.editForm);
    if (discountLink.id !== null) {
      this.subscribeToSaveResponse(this.discountLinkService.update(discountLink));
    } else {
      this.subscribeToSaveResponse(this.discountLinkService.create(discountLink));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscountLink>>): void {
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

  protected updateForm(discountLink: IDiscountLink): void {
    this.discountLink = discountLink;
    this.discountLinkFormService.resetForm(this.editForm, discountLink);

    this.discountUsagesSharedCollection = this.discountUsageService.addDiscountUsageToCollectionIfMissing<IDiscountUsage>(
      this.discountUsagesSharedCollection,
      discountLink.discountUsage,
    );
    this.companiesSharedCollection = this.companyService.addCompanyToCollectionIfMissing<ICompany>(
      this.companiesSharedCollection,
      discountLink.company,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.discountUsageService
      .query()
      .pipe(map((res: HttpResponse<IDiscountUsage[]>) => res.body ?? []))
      .pipe(
        map((discountUsages: IDiscountUsage[]) =>
          this.discountUsageService.addDiscountUsageToCollectionIfMissing<IDiscountUsage>(discountUsages, this.discountLink?.discountUsage),
        ),
      )
      .subscribe((discountUsages: IDiscountUsage[]) => (this.discountUsagesSharedCollection = discountUsages));

    this.companyService
      .query()
      .pipe(map((res: HttpResponse<ICompany[]>) => res.body ?? []))
      .pipe(
        map((companies: ICompany[]) =>
          this.companyService.addCompanyToCollectionIfMissing<ICompany>(companies, this.discountLink?.company),
        ),
      )
      .subscribe((companies: ICompany[]) => (this.companiesSharedCollection = companies));
  }
}

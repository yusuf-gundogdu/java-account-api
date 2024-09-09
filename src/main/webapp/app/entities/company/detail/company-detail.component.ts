import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ICompany } from '../company.model';

@Component({
  standalone: true,
  selector: 'jhi-company-detail',
  templateUrl: './company-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CompanyDetailComponent {
  company = input<ICompany | null>(null);

  previousState(): void {
    window.history.back();
  }
}

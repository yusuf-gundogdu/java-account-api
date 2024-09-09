import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IDiscountUsage } from '../discount-usage.model';

@Component({
  standalone: true,
  selector: 'jhi-discount-usage-detail',
  templateUrl: './discount-usage-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DiscountUsageDetailComponent {
  discountUsage = input<IDiscountUsage | null>(null);

  previousState(): void {
    window.history.back();
  }
}

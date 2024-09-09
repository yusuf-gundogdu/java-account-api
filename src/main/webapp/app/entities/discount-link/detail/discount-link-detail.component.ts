import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IDiscountLink } from '../discount-link.model';

@Component({
  standalone: true,
  selector: 'jhi-discount-link-detail',
  templateUrl: './discount-link-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class DiscountLinkDetailComponent {
  discountLink = input<IDiscountLink | null>(null);

  previousState(): void {
    window.history.back();
  }
}

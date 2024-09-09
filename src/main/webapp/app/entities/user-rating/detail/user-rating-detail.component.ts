import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IUserRating } from '../user-rating.model';

@Component({
  standalone: true,
  selector: 'jhi-user-rating-detail',
  templateUrl: './user-rating-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class UserRatingDetailComponent {
  userRating = input<IUserRating | null>(null);

  previousState(): void {
    window.history.back();
  }
}

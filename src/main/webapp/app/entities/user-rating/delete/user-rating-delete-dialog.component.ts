import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserRating } from '../user-rating.model';
import { UserRatingService } from '../service/user-rating.service';

@Component({
  standalone: true,
  templateUrl: './user-rating-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserRatingDeleteDialogComponent {
  userRating?: IUserRating;

  protected userRatingService = inject(UserRatingService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.userRatingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

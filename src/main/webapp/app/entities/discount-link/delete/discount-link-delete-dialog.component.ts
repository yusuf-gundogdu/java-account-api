import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDiscountLink } from '../discount-link.model';
import { DiscountLinkService } from '../service/discount-link.service';

@Component({
  standalone: true,
  templateUrl: './discount-link-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DiscountLinkDeleteDialogComponent {
  discountLink?: IDiscountLink;

  protected discountLinkService = inject(DiscountLinkService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.discountLinkService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

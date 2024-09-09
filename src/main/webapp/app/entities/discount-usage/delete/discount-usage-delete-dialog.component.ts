import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDiscountUsage } from '../discount-usage.model';
import { DiscountUsageService } from '../service/discount-usage.service';

@Component({
  standalone: true,
  templateUrl: './discount-usage-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DiscountUsageDeleteDialogComponent {
  discountUsage?: IDiscountUsage;

  protected discountUsageService = inject(DiscountUsageService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.discountUsageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

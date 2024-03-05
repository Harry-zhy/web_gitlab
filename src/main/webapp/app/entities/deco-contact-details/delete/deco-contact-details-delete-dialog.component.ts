import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoContactDetails } from '../deco-contact-details.model';
import { DecoContactDetailsService } from '../service/deco-contact-details.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-contact-details-delete-dialog.component.html',
})
export class DecoContactDetailsDeleteDialogComponent {
  decoContactDetails?: IDecoContactDetails;

  constructor(protected decoContactDetailsService: DecoContactDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoContactDetailsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

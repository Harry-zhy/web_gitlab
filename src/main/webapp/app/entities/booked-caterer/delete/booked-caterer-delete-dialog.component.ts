import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookedCaterer } from '../booked-caterer.model';
import { BookedCatererService } from '../service/booked-caterer.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './booked-caterer-delete-dialog.component.html',
})
export class BookedCatererDeleteDialogComponent {
  bookedCaterer?: IBookedCaterer;

  constructor(protected bookedCatererService: BookedCatererService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookedCatererService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

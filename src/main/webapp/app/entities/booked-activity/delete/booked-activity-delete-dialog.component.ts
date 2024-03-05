import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBookedActivity } from '../booked-activity.model';
import { BookedActivityService } from '../service/booked-activity.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './booked-activity-delete-dialog.component.html',
})
export class BookedActivityDeleteDialogComponent {
  bookedActivity?: IBookedActivity;

  constructor(protected bookedActivityService: BookedActivityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookedActivityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

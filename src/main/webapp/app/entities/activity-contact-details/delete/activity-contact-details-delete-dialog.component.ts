import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityContactDetails } from '../activity-contact-details.model';
import { ActivityContactDetailsService } from '../service/activity-contact-details.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './activity-contact-details-delete-dialog.component.html',
})
export class ActivityContactDetailsDeleteDialogComponent {
  activityContactDetails?: IActivityContactDetails;

  constructor(protected activityContactDetailsService: ActivityContactDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activityContactDetailsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivitySaved } from '../activity-saved.model';
import { ActivitySavedService } from '../service/activity-saved.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './activity-saved-delete-dialog.component.html',
})
export class ActivitySavedDeleteDialogComponent {
  activitySaved?: IActivitySaved;

  constructor(protected activitySavedService: ActivitySavedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activitySavedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

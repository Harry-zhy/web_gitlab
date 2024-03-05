import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivitySelf } from '../activity-self.model';
import { ActivitySelfService } from '../service/activity-self.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './activity-self-delete-dialog.component.html',
})
export class ActivitySelfDeleteDialogComponent {
  activitySelf?: IActivitySelf;

  constructor(protected activitySelfService: ActivitySelfService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activitySelfService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

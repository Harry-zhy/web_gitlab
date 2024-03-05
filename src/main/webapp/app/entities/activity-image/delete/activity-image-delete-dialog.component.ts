import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityImage } from '../activity-image.model';
import { ActivityImageService } from '../service/activity-image.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './activity-image-delete-dialog.component.html',
})
export class ActivityImageDeleteDialogComponent {
  activityImage?: IActivityImage;

  constructor(protected activityImageService: ActivityImageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activityImageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

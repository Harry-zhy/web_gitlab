import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityIdea } from '../activity-idea.model';
import { ActivityIdeaService } from '../service/activity-idea.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './activity-idea-delete-dialog.component.html',
})
export class ActivityIdeaDeleteDialogComponent {
  activityIdea?: IActivityIdea;

  constructor(protected activityIdeaService: ActivityIdeaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activityIdeaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

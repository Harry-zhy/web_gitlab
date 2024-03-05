import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFeedbacks } from '../feedbacks.model';
import { FeedbacksService } from '../service/feedbacks.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './feedbacks-delete-dialog.component.html',
})
export class FeedbacksDeleteDialogComponent {
  feedbacks?: IFeedbacks;

  constructor(protected feedbacksService: FeedbacksService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.feedbacksService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

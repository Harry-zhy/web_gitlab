import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOneFeedback } from '../one-feedback.model';
import { OneFeedbackService } from '../service/one-feedback.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './one-feedback-delete-dialog.component.html',
})
export class OneFeedbackDeleteDialogComponent {
  oneFeedback?: IOneFeedback;

  constructor(protected oneFeedbackService: OneFeedbackService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.oneFeedbackService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

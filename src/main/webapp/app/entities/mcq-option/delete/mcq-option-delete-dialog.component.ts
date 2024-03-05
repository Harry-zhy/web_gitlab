import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMCQOption } from '../mcq-option.model';
import { MCQOptionService } from '../service/mcq-option.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mcq-option-delete-dialog.component.html',
})
export class MCQOptionDeleteDialogComponent {
  mCQOption?: IMCQOption;

  constructor(protected mCQOptionService: MCQOptionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mCQOptionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

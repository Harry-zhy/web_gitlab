import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICaterers } from '../caterers.model';
import { CaterersService } from '../service/caterers.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './caterers-delete-dialog.component.html',
})
export class CaterersDeleteDialogComponent {
  caterers?: ICaterers;

  constructor(protected caterersService: CaterersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.caterersService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

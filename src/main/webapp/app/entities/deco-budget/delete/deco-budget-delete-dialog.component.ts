import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoBudget } from '../deco-budget.model';
import { DecoBudgetService } from '../service/deco-budget.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-budget-delete-dialog.component.html',
})
export class DecoBudgetDeleteDialogComponent {
  decoBudget?: IDecoBudget;

  constructor(protected decoBudgetService: DecoBudgetService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoBudgetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

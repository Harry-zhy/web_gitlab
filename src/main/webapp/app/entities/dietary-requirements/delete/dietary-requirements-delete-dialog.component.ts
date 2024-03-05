import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDietaryRequirements } from '../dietary-requirements.model';
import { DietaryRequirementsService } from '../service/dietary-requirements.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './dietary-requirements-delete-dialog.component.html',
})
export class DietaryRequirementsDeleteDialogComponent {
  dietaryRequirements?: IDietaryRequirements;

  constructor(protected dietaryRequirementsService: DietaryRequirementsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.dietaryRequirementsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

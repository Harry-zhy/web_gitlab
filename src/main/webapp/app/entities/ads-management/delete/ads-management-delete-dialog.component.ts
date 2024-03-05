import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAdsManagement } from '../ads-management.model';
import { AdsManagementService } from '../service/ads-management.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './ads-management-delete-dialog.component.html',
})
export class AdsManagementDeleteDialogComponent {
  adsManagement?: IAdsManagement;

  constructor(protected adsManagementService: AdsManagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.adsManagementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

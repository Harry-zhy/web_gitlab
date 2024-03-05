import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IActivityCompany } from '../activity-company.model';
import { ActivityCompanyService } from '../service/activity-company.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './activity-company-delete-dialog.component.html',
})
export class ActivityCompanyDeleteDialogComponent {
  activityCompany?: IActivityCompany;

  constructor(protected activityCompanyService: ActivityCompanyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.activityCompanyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

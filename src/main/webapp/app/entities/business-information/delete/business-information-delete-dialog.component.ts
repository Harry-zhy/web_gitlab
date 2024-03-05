import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBusinessInformation } from '../business-information.model';
import { BusinessInformationService } from '../service/business-information.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './business-information-delete-dialog.component.html',
})
export class BusinessInformationDeleteDialogComponent {
  businessInformation?: IBusinessInformation;

  constructor(protected businessInformationService: BusinessInformationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.businessInformationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

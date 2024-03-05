import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoSavedCompany } from '../deco-saved-company.model';
import { DecoSavedCompanyService } from '../service/deco-saved-company.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-saved-company-delete-dialog.component.html',
})
export class DecoSavedCompanyDeleteDialogComponent {
  decoSavedCompany?: IDecoSavedCompany;

  constructor(protected decoSavedCompanyService: DecoSavedCompanyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoSavedCompanyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoCompany } from '../deco-company.model';
import { DecoCompanyService } from '../service/deco-company.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-company-delete-dialog.component.html',
})
export class DecoCompanyDeleteDialogComponent {
  decoCompany?: IDecoCompany;

  constructor(protected decoCompanyService: DecoCompanyService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoCompanyService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMockCatererEntity } from '../mock-caterer-entity.model';
import { MockCatererEntityService } from '../service/mock-caterer-entity.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mock-caterer-entity-delete-dialog.component.html',
})
export class MockCatererEntityDeleteDialogComponent {
  mockCatererEntity?: IMockCatererEntity;

  constructor(protected mockCatererEntityService: MockCatererEntityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mockCatererEntityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

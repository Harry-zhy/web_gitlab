import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMockVenueEntity } from '../mock-venue-entity.model';
import { MockVenueEntityService } from '../service/mock-venue-entity.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mock-venue-entity-delete-dialog.component.html',
})
export class MockVenueEntityDeleteDialogComponent {
  mockVenueEntity?: IMockVenueEntity;

  constructor(protected mockVenueEntityService: MockVenueEntityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mockVenueEntityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItineraryCaterer } from '../itinerary-caterer.model';
import { ItineraryCatererService } from '../service/itinerary-caterer.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './itinerary-caterer-delete-dialog.component.html',
})
export class ItineraryCatererDeleteDialogComponent {
  itineraryCaterer?: IItineraryCaterer;

  constructor(protected itineraryCatererService: ItineraryCatererService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itineraryCatererService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

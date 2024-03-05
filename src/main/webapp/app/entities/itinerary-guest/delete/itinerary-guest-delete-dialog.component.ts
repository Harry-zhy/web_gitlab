import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItineraryGuest } from '../itinerary-guest.model';
import { ItineraryGuestService } from '../service/itinerary-guest.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './itinerary-guest-delete-dialog.component.html',
})
export class ItineraryGuestDeleteDialogComponent {
  itineraryGuest?: IItineraryGuest;

  constructor(protected itineraryGuestService: ItineraryGuestService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itineraryGuestService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

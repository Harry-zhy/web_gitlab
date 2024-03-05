import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItineraryVenue } from '../itinerary-venue.model';
import { ItineraryVenueService } from '../service/itinerary-venue.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './itinerary-venue-delete-dialog.component.html',
})
export class ItineraryVenueDeleteDialogComponent {
  itineraryVenue?: IItineraryVenue;

  constructor(protected itineraryVenueService: ItineraryVenueService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itineraryVenueService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

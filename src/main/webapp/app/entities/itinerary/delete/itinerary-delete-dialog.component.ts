import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItinerary } from '../itinerary.model';
import { ItineraryService } from '../service/itinerary.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './itinerary-delete-dialog.component.html',
})
export class ItineraryDeleteDialogComponent {
  itinerary?: IItinerary;

  constructor(protected itineraryService: ItineraryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itineraryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

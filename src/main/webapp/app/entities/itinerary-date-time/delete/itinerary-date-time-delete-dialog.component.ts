import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItineraryDateTime } from '../itinerary-date-time.model';
import { ItineraryDateTimeService } from '../service/itinerary-date-time.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './itinerary-date-time-delete-dialog.component.html',
})
export class ItineraryDateTimeDeleteDialogComponent {
  itineraryDateTime?: IItineraryDateTime;

  constructor(protected itineraryDateTimeService: ItineraryDateTimeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itineraryDateTimeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEventItinerary } from '../event-itinerary.model';
import { EventItineraryService } from '../service/event-itinerary.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './event-itinerary-delete-dialog.component.html',
})
export class EventItineraryDeleteDialogComponent {
  eventItinerary?: IEventItinerary;

  constructor(protected eventItineraryService: EventItineraryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.eventItineraryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IItineraryActivity } from '../itinerary-activity.model';
import { ItineraryActivityService } from '../service/itinerary-activity.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './itinerary-activity-delete-dialog.component.html',
})
export class ItineraryActivityDeleteDialogComponent {
  itineraryActivity?: IItineraryActivity;

  constructor(protected itineraryActivityService: ItineraryActivityService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.itineraryActivityService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

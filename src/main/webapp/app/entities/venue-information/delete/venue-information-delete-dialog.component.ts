import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVenueInformation } from '../venue-information.model';
import { VenueInformationService } from '../service/venue-information.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './venue-information-delete-dialog.component.html',
})
export class VenueInformationDeleteDialogComponent {
  venueInformation?: IVenueInformation;

  constructor(protected venueInformationService: VenueInformationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.venueInformationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

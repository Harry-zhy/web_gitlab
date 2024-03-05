import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItineraryGuestComponent } from './list/itinerary-guest.component';
import { ItineraryGuestDetailComponent } from './detail/itinerary-guest-detail.component';
import { ItineraryGuestUpdateComponent } from './update/itinerary-guest-update.component';
import { ItineraryGuestDeleteDialogComponent } from './delete/itinerary-guest-delete-dialog.component';
import { ItineraryGuestRoutingModule } from './route/itinerary-guest-routing.module';

@NgModule({
  imports: [SharedModule, ItineraryGuestRoutingModule],
  declarations: [
    ItineraryGuestComponent,
    ItineraryGuestDetailComponent,
    ItineraryGuestUpdateComponent,
    ItineraryGuestDeleteDialogComponent,
  ],
})
export class ItineraryGuestModule {}

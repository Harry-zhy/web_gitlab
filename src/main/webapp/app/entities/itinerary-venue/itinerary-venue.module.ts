import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItineraryVenueComponent } from './list/itinerary-venue.component';
import { ItineraryVenueDetailComponent } from './detail/itinerary-venue-detail.component';
import { ItineraryVenueUpdateComponent } from './update/itinerary-venue-update.component';
import { ItineraryVenueDeleteDialogComponent } from './delete/itinerary-venue-delete-dialog.component';
import { ItineraryVenueRoutingModule } from './route/itinerary-venue-routing.module';

@NgModule({
  imports: [SharedModule, ItineraryVenueRoutingModule],
  declarations: [
    ItineraryVenueComponent,
    ItineraryVenueDetailComponent,
    ItineraryVenueUpdateComponent,
    ItineraryVenueDeleteDialogComponent,
  ],
})
export class ItineraryVenueModule {}

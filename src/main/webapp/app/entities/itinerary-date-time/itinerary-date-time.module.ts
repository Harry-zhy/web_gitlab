import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItineraryDateTimeComponent } from './list/itinerary-date-time.component';
import { ItineraryDateTimeDetailComponent } from './detail/itinerary-date-time-detail.component';
import { ItineraryDateTimeUpdateComponent } from './update/itinerary-date-time-update.component';
import { ItineraryDateTimeDeleteDialogComponent } from './delete/itinerary-date-time-delete-dialog.component';
import { ItineraryDateTimeRoutingModule } from './route/itinerary-date-time-routing.module';

@NgModule({
  imports: [SharedModule, ItineraryDateTimeRoutingModule],
  declarations: [
    ItineraryDateTimeComponent,
    ItineraryDateTimeDetailComponent,
    ItineraryDateTimeUpdateComponent,
    ItineraryDateTimeDeleteDialogComponent,
  ],
})
export class ItineraryDateTimeModule {}

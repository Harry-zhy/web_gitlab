import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItineraryActivityComponent } from './list/itinerary-activity.component';
import { ItineraryActivityDetailComponent } from './detail/itinerary-activity-detail.component';
import { ItineraryActivityUpdateComponent } from './update/itinerary-activity-update.component';
import { ItineraryActivityDeleteDialogComponent } from './delete/itinerary-activity-delete-dialog.component';
import { ItineraryActivityRoutingModule } from './route/itinerary-activity-routing.module';

@NgModule({
  imports: [SharedModule, ItineraryActivityRoutingModule],
  declarations: [
    ItineraryActivityComponent,
    ItineraryActivityDetailComponent,
    ItineraryActivityUpdateComponent,
    ItineraryActivityDeleteDialogComponent,
  ],
})
export class ItineraryActivityModule {}

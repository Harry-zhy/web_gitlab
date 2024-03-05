import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItineraryComponent } from './list/itinerary.component';
import { ItineraryDetailComponent } from './detail/itinerary-detail.component';
import { ItineraryUpdateComponent } from './update/itinerary-update.component';
import { ItineraryDeleteDialogComponent } from './delete/itinerary-delete-dialog.component';
import { ItineraryRoutingModule } from './route/itinerary-routing.module';

@NgModule({
  imports: [SharedModule, ItineraryRoutingModule],
  declarations: [ItineraryComponent, ItineraryDetailComponent, ItineraryUpdateComponent, ItineraryDeleteDialogComponent],
})
export class ItineraryModule {}

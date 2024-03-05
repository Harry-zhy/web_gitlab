import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EventItineraryComponent } from './list/event-itinerary.component';
import { EventItineraryDetailComponent } from './detail/event-itinerary-detail.component';
import { EventItineraryUpdateComponent } from './update/event-itinerary-update.component';
import { EventItineraryDeleteDialogComponent } from './delete/event-itinerary-delete-dialog.component';
import { EventItineraryRoutingModule } from './route/event-itinerary-routing.module';

@NgModule({
  imports: [SharedModule, EventItineraryRoutingModule],
  declarations: [
    EventItineraryComponent,
    EventItineraryDetailComponent,
    EventItineraryUpdateComponent,
    EventItineraryDeleteDialogComponent,
  ],
})
export class EventItineraryModule {}

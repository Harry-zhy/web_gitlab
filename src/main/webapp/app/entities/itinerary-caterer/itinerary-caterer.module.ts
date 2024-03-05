import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItineraryCatererComponent } from './list/itinerary-caterer.component';
import { ItineraryCatererDetailComponent } from './detail/itinerary-caterer-detail.component';
import { ItineraryCatererUpdateComponent } from './update/itinerary-caterer-update.component';
import { ItineraryCatererDeleteDialogComponent } from './delete/itinerary-caterer-delete-dialog.component';
import { ItineraryCatererRoutingModule } from './route/itinerary-caterer-routing.module';

@NgModule({
  imports: [SharedModule, ItineraryCatererRoutingModule],
  declarations: [
    ItineraryCatererComponent,
    ItineraryCatererDetailComponent,
    ItineraryCatererUpdateComponent,
    ItineraryCatererDeleteDialogComponent,
  ],
})
export class ItineraryCatererModule {}

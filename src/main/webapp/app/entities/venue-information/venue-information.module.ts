import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VenueInformationComponent } from './list/venue-information.component';
import { VenueInformationDetailComponent } from './detail/venue-information-detail.component';
import { VenueInformationUpdateComponent } from './update/venue-information-update.component';
import { VenueInformationDeleteDialogComponent } from './delete/venue-information-delete-dialog.component';
import { VenueInformationRoutingModule } from './route/venue-information-routing.module';

@NgModule({
  imports: [SharedModule, VenueInformationRoutingModule],
  declarations: [
    VenueInformationComponent,
    VenueInformationDetailComponent,
    VenueInformationUpdateComponent,
    VenueInformationDeleteDialogComponent,
  ],
})
export class VenueInformationModule {}

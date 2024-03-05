import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MockVenueEntityComponent } from './list/mock-venue-entity.component';
import { MockVenueEntityDetailComponent } from './detail/mock-venue-entity-detail.component';
import { MockVenueEntityUpdateComponent } from './update/mock-venue-entity-update.component';
import { MockVenueEntityDeleteDialogComponent } from './delete/mock-venue-entity-delete-dialog.component';
import { MockVenueEntityRoutingModule } from './route/mock-venue-entity-routing.module';

@NgModule({
  imports: [SharedModule, MockVenueEntityRoutingModule],
  declarations: [
    MockVenueEntityComponent,
    MockVenueEntityDetailComponent,
    MockVenueEntityUpdateComponent,
    MockVenueEntityDeleteDialogComponent,
  ],
})
export class MockVenueEntityModule {}

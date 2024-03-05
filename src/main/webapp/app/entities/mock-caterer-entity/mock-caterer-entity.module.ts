import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MockCatererEntityComponent } from './list/mock-caterer-entity.component';
import { MockCatererEntityDetailComponent } from './detail/mock-caterer-entity-detail.component';
import { MockCatererEntityUpdateComponent } from './update/mock-caterer-entity-update.component';
import { MockCatererEntityDeleteDialogComponent } from './delete/mock-caterer-entity-delete-dialog.component';
import { MockCatererEntityRoutingModule } from './route/mock-caterer-entity-routing.module';

@NgModule({
  imports: [SharedModule, MockCatererEntityRoutingModule],
  declarations: [
    MockCatererEntityComponent,
    MockCatererEntityDetailComponent,
    MockCatererEntityUpdateComponent,
    MockCatererEntityDeleteDialogComponent,
  ],
})
export class MockCatererEntityModule {}

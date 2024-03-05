import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MockActivityEntityComponent } from './list/mock-activity-entity.component';
import { MockActivityEntityDetailComponent } from './detail/mock-activity-entity-detail.component';
import { MockActivityEntityUpdateComponent } from './update/mock-activity-entity-update.component';
import { MockActivityEntityDeleteDialogComponent } from './delete/mock-activity-entity-delete-dialog.component';
import { MockActivityEntityRoutingModule } from './route/mock-activity-entity-routing.module';

@NgModule({
  imports: [SharedModule, MockActivityEntityRoutingModule],
  declarations: [
    MockActivityEntityComponent,
    MockActivityEntityDetailComponent,
    MockActivityEntityUpdateComponent,
    MockActivityEntityDeleteDialogComponent,
  ],
})
export class MockActivityEntityModule {}

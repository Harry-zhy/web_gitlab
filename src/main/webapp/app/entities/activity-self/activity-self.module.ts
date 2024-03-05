import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivitySelfComponent } from './list/activity-self.component';
import { ActivitySelfDetailComponent } from './detail/activity-self-detail.component';
import { ActivitySelfUpdateComponent } from './update/activity-self-update.component';
import { ActivitySelfDeleteDialogComponent } from './delete/activity-self-delete-dialog.component';
import { ActivitySelfRoutingModule } from './route/activity-self-routing.module';

@NgModule({
  imports: [SharedModule, ActivitySelfRoutingModule],
  declarations: [ActivitySelfComponent, ActivitySelfDetailComponent, ActivitySelfUpdateComponent, ActivitySelfDeleteDialogComponent],
})
export class ActivitySelfModule {}

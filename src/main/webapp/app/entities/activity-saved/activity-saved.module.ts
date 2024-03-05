import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivitySavedComponent } from './list/activity-saved.component';
import { ActivitySavedDetailComponent } from './detail/activity-saved-detail.component';
import { ActivitySavedUpdateComponent } from './update/activity-saved-update.component';
import { ActivitySavedDeleteDialogComponent } from './delete/activity-saved-delete-dialog.component';
import { ActivitySavedRoutingModule } from './route/activity-saved-routing.module';

@NgModule({
  imports: [SharedModule, ActivitySavedRoutingModule],
  declarations: [ActivitySavedComponent, ActivitySavedDetailComponent, ActivitySavedUpdateComponent, ActivitySavedDeleteDialogComponent],
})
export class ActivitySavedModule {}

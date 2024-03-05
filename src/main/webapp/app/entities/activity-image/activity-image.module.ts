import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivityImageComponent } from './list/activity-image.component';
import { ActivityImageDetailComponent } from './detail/activity-image-detail.component';
import { ActivityImageUpdateComponent } from './update/activity-image-update.component';
import { ActivityImageDeleteDialogComponent } from './delete/activity-image-delete-dialog.component';
import { ActivityImageRoutingModule } from './route/activity-image-routing.module';

@NgModule({
  imports: [SharedModule, ActivityImageRoutingModule],
  declarations: [ActivityImageComponent, ActivityImageDetailComponent, ActivityImageUpdateComponent, ActivityImageDeleteDialogComponent],
})
export class ActivityImageModule {}

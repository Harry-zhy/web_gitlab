import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivityIdeaComponent } from './list/activity-idea.component';
import { ActivityIdeaDetailComponent } from './detail/activity-idea-detail.component';
import { ActivityIdeaUpdateComponent } from './update/activity-idea-update.component';
import { ActivityIdeaDeleteDialogComponent } from './delete/activity-idea-delete-dialog.component';
import { ActivityIdeaRoutingModule } from './route/activity-idea-routing.module';

@NgModule({
  imports: [SharedModule, ActivityIdeaRoutingModule],
  declarations: [ActivityIdeaComponent, ActivityIdeaDetailComponent, ActivityIdeaUpdateComponent, ActivityIdeaDeleteDialogComponent],
})
export class ActivityIdeaModule {}

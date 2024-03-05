import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeedbacksComponent } from './list/feedbacks.component';
import { FeedbacksDetailComponent } from './detail/feedbacks-detail.component';
import { FeedbacksUpdateComponent } from './update/feedbacks-update.component';
import { FeedbacksDeleteDialogComponent } from './delete/feedbacks-delete-dialog.component';
import { FeedbacksRoutingModule } from './route/feedbacks-routing.module';

@NgModule({
  imports: [SharedModule, FeedbacksRoutingModule],
  declarations: [FeedbacksComponent, FeedbacksDetailComponent, FeedbacksUpdateComponent, FeedbacksDeleteDialogComponent],
})
export class FeedbacksModule {}

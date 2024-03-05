import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { OneFeedbackComponent } from './list/one-feedback.component';
import { OneFeedbackDetailComponent } from './detail/one-feedback-detail.component';
import { OneFeedbackUpdateComponent } from './update/one-feedback-update.component';
import { OneFeedbackDeleteDialogComponent } from './delete/one-feedback-delete-dialog.component';
import { OneFeedbackRoutingModule } from './route/one-feedback-routing.module';

@NgModule({
  imports: [SharedModule, OneFeedbackRoutingModule],
  declarations: [OneFeedbackComponent, OneFeedbackDetailComponent, OneFeedbackUpdateComponent, OneFeedbackDeleteDialogComponent],
})
export class OneFeedbackModule {}

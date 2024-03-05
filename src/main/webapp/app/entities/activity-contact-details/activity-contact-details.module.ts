import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivityContactDetailsComponent } from './list/activity-contact-details.component';
import { ActivityContactDetailsDetailComponent } from './detail/activity-contact-details-detail.component';
import { ActivityContactDetailsUpdateComponent } from './update/activity-contact-details-update.component';
import { ActivityContactDetailsDeleteDialogComponent } from './delete/activity-contact-details-delete-dialog.component';
import { ActivityContactDetailsRoutingModule } from './route/activity-contact-details-routing.module';

@NgModule({
  imports: [SharedModule, ActivityContactDetailsRoutingModule],
  declarations: [
    ActivityContactDetailsComponent,
    ActivityContactDetailsDetailComponent,
    ActivityContactDetailsUpdateComponent,
    ActivityContactDetailsDeleteDialogComponent,
  ],
})
export class ActivityContactDetailsModule {}

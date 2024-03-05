import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BookedActivityComponent } from './list/booked-activity.component';
import { BookedActivityDetailComponent } from './detail/booked-activity-detail.component';
import { BookedActivityUpdateComponent } from './update/booked-activity-update.component';
import { BookedActivityDeleteDialogComponent } from './delete/booked-activity-delete-dialog.component';
import { BookedActivityRoutingModule } from './route/booked-activity-routing.module';

@NgModule({
  imports: [SharedModule, BookedActivityRoutingModule],
  declarations: [
    BookedActivityComponent,
    BookedActivityDetailComponent,
    BookedActivityUpdateComponent,
    BookedActivityDeleteDialogComponent,
  ],
})
export class BookedActivityModule {}

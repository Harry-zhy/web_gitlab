import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BookedCatererComponent } from './list/booked-caterer.component';
import { BookedCatererDetailComponent } from './detail/booked-caterer-detail.component';
import { BookedCatererUpdateComponent } from './update/booked-caterer-update.component';
import { BookedCatererDeleteDialogComponent } from './delete/booked-caterer-delete-dialog.component';
import { BookedCatererRoutingModule } from './route/booked-caterer-routing.module';

@NgModule({
  imports: [SharedModule, BookedCatererRoutingModule],
  declarations: [BookedCatererComponent, BookedCatererDetailComponent, BookedCatererUpdateComponent, BookedCatererDeleteDialogComponent],
})
export class BookedCatererModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoContactDetailsComponent } from './list/deco-contact-details.component';
import { DecoContactDetailsDetailComponent } from './detail/deco-contact-details-detail.component';
import { DecoContactDetailsUpdateComponent } from './update/deco-contact-details-update.component';
import { DecoContactDetailsDeleteDialogComponent } from './delete/deco-contact-details-delete-dialog.component';
import { DecoContactDetailsRoutingModule } from './route/deco-contact-details-routing.module';

@NgModule({
  imports: [SharedModule, DecoContactDetailsRoutingModule],
  declarations: [
    DecoContactDetailsComponent,
    DecoContactDetailsDetailComponent,
    DecoContactDetailsUpdateComponent,
    DecoContactDetailsDeleteDialogComponent,
  ],
})
export class DecoContactDetailsModule {}

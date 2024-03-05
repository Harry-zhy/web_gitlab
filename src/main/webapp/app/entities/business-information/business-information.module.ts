import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BusinessInformationComponent } from './list/business-information.component';
import { BusinessInformationDetailComponent } from './detail/business-information-detail.component';
import { BusinessInformationUpdateComponent } from './update/business-information-update.component';
import { BusinessInformationDeleteDialogComponent } from './delete/business-information-delete-dialog.component';
import { BusinessInformationRoutingModule } from './route/business-information-routing.module';

@NgModule({
  imports: [SharedModule, BusinessInformationRoutingModule],
  declarations: [
    BusinessInformationComponent,
    BusinessInformationDetailComponent,
    BusinessInformationUpdateComponent,
    BusinessInformationDeleteDialogComponent,
  ],
})
export class BusinessInformationModule {}

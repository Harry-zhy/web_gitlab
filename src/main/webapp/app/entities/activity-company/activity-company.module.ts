import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ActivityCompanyComponent } from './list/activity-company.component';
import { ActivityCompanyDetailComponent } from './detail/activity-company-detail.component';
import { ActivityCompanyUpdateComponent } from './update/activity-company-update.component';
import { ActivityCompanyDeleteDialogComponent } from './delete/activity-company-delete-dialog.component';
import { ActivityCompanyRoutingModule } from './route/activity-company-routing.module';

@NgModule({
  imports: [SharedModule, ActivityCompanyRoutingModule],
  declarations: [
    ActivityCompanyComponent,
    ActivityCompanyDetailComponent,
    ActivityCompanyUpdateComponent,
    ActivityCompanyDeleteDialogComponent,
  ],
})
export class ActivityCompanyModule {}

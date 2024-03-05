import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AdsManagementComponent } from './list/ads-management.component';
import { AdsManagementDetailComponent } from './detail/ads-management-detail.component';
import { AdsManagementUpdateComponent } from './update/ads-management-update.component';
import { AdsManagementDeleteDialogComponent } from './delete/ads-management-delete-dialog.component';
import { AdsManagementRoutingModule } from './route/ads-management-routing.module';

@NgModule({
  imports: [SharedModule, AdsManagementRoutingModule],
  declarations: [AdsManagementComponent, AdsManagementDetailComponent, AdsManagementUpdateComponent, AdsManagementDeleteDialogComponent],
})
export class AdsManagementModule {}

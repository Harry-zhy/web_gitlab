import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AdsManagementComponent } from '../list/ads-management.component';
import { AdsManagementDetailComponent } from '../detail/ads-management-detail.component';
import { AdsManagementUpdateComponent } from '../update/ads-management-update.component';
import { AdsManagementRoutingResolveService } from './ads-management-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const adsManagementRoute: Routes = [
  {
    path: '',
    component: AdsManagementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AdsManagementDetailComponent,
    resolve: {
      adsManagement: AdsManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AdsManagementUpdateComponent,
    resolve: {
      adsManagement: AdsManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AdsManagementUpdateComponent,
    resolve: {
      adsManagement: AdsManagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adsManagementRoute)],
  exports: [RouterModule],
})
export class AdsManagementRoutingModule {}

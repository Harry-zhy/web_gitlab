import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BusinessInformationComponent } from '../list/business-information.component';
import { BusinessInformationDetailComponent } from '../detail/business-information-detail.component';
import { BusinessInformationUpdateComponent } from '../update/business-information-update.component';
import { BusinessInformationRoutingResolveService } from './business-information-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const businessInformationRoute: Routes = [
  {
    path: '',
    component: BusinessInformationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BusinessInformationDetailComponent,
    resolve: {
      businessInformation: BusinessInformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BusinessInformationUpdateComponent,
    resolve: {
      businessInformation: BusinessInformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BusinessInformationUpdateComponent,
    resolve: {
      businessInformation: BusinessInformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(businessInformationRoute)],
  exports: [RouterModule],
})
export class BusinessInformationRoutingModule {}

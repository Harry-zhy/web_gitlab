import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivityCompanyComponent } from '../list/activity-company.component';
import { ActivityCompanyDetailComponent } from '../detail/activity-company-detail.component';
import { ActivityCompanyUpdateComponent } from '../update/activity-company-update.component';
import { ActivityCompanyRoutingResolveService } from './activity-company-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const activityCompanyRoute: Routes = [
  {
    path: '',
    component: ActivityCompanyComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivityCompanyDetailComponent,
    resolve: {
      activityCompany: ActivityCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivityCompanyUpdateComponent,
    resolve: {
      activityCompany: ActivityCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivityCompanyUpdateComponent,
    resolve: {
      activityCompany: ActivityCompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activityCompanyRoute)],
  exports: [RouterModule],
})
export class ActivityCompanyRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivitySelfComponent } from '../list/activity-self.component';
import { ActivitySelfDetailComponent } from '../detail/activity-self-detail.component';
import { ActivitySelfUpdateComponent } from '../update/activity-self-update.component';
import { ActivitySelfRoutingResolveService } from './activity-self-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const activitySelfRoute: Routes = [
  {
    path: '',
    component: ActivitySelfComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivitySelfDetailComponent,
    resolve: {
      activitySelf: ActivitySelfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivitySelfUpdateComponent,
    resolve: {
      activitySelf: ActivitySelfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivitySelfUpdateComponent,
    resolve: {
      activitySelf: ActivitySelfRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activitySelfRoute)],
  exports: [RouterModule],
})
export class ActivitySelfRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivityImageComponent } from '../list/activity-image.component';
import { ActivityImageDetailComponent } from '../detail/activity-image-detail.component';
import { ActivityImageUpdateComponent } from '../update/activity-image-update.component';
import { ActivityImageRoutingResolveService } from './activity-image-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const activityImageRoute: Routes = [
  {
    path: '',
    component: ActivityImageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivityImageDetailComponent,
    resolve: {
      activityImage: ActivityImageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivityImageUpdateComponent,
    resolve: {
      activityImage: ActivityImageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivityImageUpdateComponent,
    resolve: {
      activityImage: ActivityImageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activityImageRoute)],
  exports: [RouterModule],
})
export class ActivityImageRoutingModule {}

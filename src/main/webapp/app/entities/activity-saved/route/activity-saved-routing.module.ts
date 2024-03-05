import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivitySavedComponent } from '../list/activity-saved.component';
import { ActivitySavedDetailComponent } from '../detail/activity-saved-detail.component';
import { ActivitySavedUpdateComponent } from '../update/activity-saved-update.component';
import { ActivitySavedRoutingResolveService } from './activity-saved-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const activitySavedRoute: Routes = [
  {
    path: '',
    component: ActivitySavedComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivitySavedDetailComponent,
    resolve: {
      activitySaved: ActivitySavedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivitySavedUpdateComponent,
    resolve: {
      activitySaved: ActivitySavedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivitySavedUpdateComponent,
    resolve: {
      activitySaved: ActivitySavedRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activitySavedRoute)],
  exports: [RouterModule],
})
export class ActivitySavedRoutingModule {}

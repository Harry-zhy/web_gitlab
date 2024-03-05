import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivityIdeaComponent } from '../list/activity-idea.component';
import { ActivityIdeaDetailComponent } from '../detail/activity-idea-detail.component';
import { ActivityIdeaUpdateComponent } from '../update/activity-idea-update.component';
import { ActivityIdeaRoutingResolveService } from './activity-idea-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const activityIdeaRoute: Routes = [
  {
    path: '',
    component: ActivityIdeaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivityIdeaDetailComponent,
    resolve: {
      activityIdea: ActivityIdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivityIdeaUpdateComponent,
    resolve: {
      activityIdea: ActivityIdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivityIdeaUpdateComponent,
    resolve: {
      activityIdea: ActivityIdeaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activityIdeaRoute)],
  exports: [RouterModule],
})
export class ActivityIdeaRoutingModule {}

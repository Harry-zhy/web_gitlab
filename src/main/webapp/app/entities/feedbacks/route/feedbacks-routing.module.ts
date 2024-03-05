import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FeedbacksComponent } from '../list/feedbacks.component';
import { FeedbacksDetailComponent } from '../detail/feedbacks-detail.component';
import { FeedbacksUpdateComponent } from '../update/feedbacks-update.component';
import { FeedbacksRoutingResolveService } from './feedbacks-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const feedbacksRoute: Routes = [
  {
    path: '',
    component: FeedbacksComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeedbacksDetailComponent,
    resolve: {
      feedbacks: FeedbacksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeedbacksUpdateComponent,
    resolve: {
      feedbacks: FeedbacksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeedbacksUpdateComponent,
    resolve: {
      feedbacks: FeedbacksRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(feedbacksRoute)],
  exports: [RouterModule],
})
export class FeedbacksRoutingModule {}

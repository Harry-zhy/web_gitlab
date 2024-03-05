import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { OneFeedbackComponent } from '../list/one-feedback.component';
import { OneFeedbackDetailComponent } from '../detail/one-feedback-detail.component';
import { OneFeedbackUpdateComponent } from '../update/one-feedback-update.component';
import { OneFeedbackRoutingResolveService } from './one-feedback-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const oneFeedbackRoute: Routes = [
  {
    path: '',
    component: OneFeedbackComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OneFeedbackDetailComponent,
    resolve: {
      oneFeedback: OneFeedbackRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OneFeedbackUpdateComponent,
    resolve: {
      oneFeedback: OneFeedbackRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OneFeedbackUpdateComponent,
    resolve: {
      oneFeedback: OneFeedbackRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(oneFeedbackRoute)],
  exports: [RouterModule],
})
export class OneFeedbackRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ActivityContactDetailsComponent } from '../list/activity-contact-details.component';
import { ActivityContactDetailsDetailComponent } from '../detail/activity-contact-details-detail.component';
import { ActivityContactDetailsUpdateComponent } from '../update/activity-contact-details-update.component';
import { ActivityContactDetailsRoutingResolveService } from './activity-contact-details-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const activityContactDetailsRoute: Routes = [
  {
    path: '',
    component: ActivityContactDetailsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActivityContactDetailsDetailComponent,
    resolve: {
      activityContactDetails: ActivityContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActivityContactDetailsUpdateComponent,
    resolve: {
      activityContactDetails: ActivityContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActivityContactDetailsUpdateComponent,
    resolve: {
      activityContactDetails: ActivityContactDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(activityContactDetailsRoute)],
  exports: [RouterModule],
})
export class ActivityContactDetailsRoutingModule {}

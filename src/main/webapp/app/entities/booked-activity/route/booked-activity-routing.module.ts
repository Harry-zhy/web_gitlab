import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookedActivityComponent } from '../list/booked-activity.component';
import { BookedActivityDetailComponent } from '../detail/booked-activity-detail.component';
import { BookedActivityUpdateComponent } from '../update/booked-activity-update.component';
import { BookedActivityRoutingResolveService } from './booked-activity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bookedActivityRoute: Routes = [
  {
    path: '',
    component: BookedActivityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookedActivityDetailComponent,
    resolve: {
      bookedActivity: BookedActivityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookedActivityUpdateComponent,
    resolve: {
      bookedActivity: BookedActivityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookedActivityUpdateComponent,
    resolve: {
      bookedActivity: BookedActivityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookedActivityRoute)],
  exports: [RouterModule],
})
export class BookedActivityRoutingModule {}

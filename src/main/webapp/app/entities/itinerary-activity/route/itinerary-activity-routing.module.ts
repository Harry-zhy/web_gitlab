import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItineraryActivityComponent } from '../list/itinerary-activity.component';
import { ItineraryActivityDetailComponent } from '../detail/itinerary-activity-detail.component';
import { ItineraryActivityUpdateComponent } from '../update/itinerary-activity-update.component';
import { ItineraryActivityRoutingResolveService } from './itinerary-activity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itineraryActivityRoute: Routes = [
  {
    path: '',
    component: ItineraryActivityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItineraryActivityDetailComponent,
    resolve: {
      itineraryActivity: ItineraryActivityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItineraryActivityUpdateComponent,
    resolve: {
      itineraryActivity: ItineraryActivityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItineraryActivityUpdateComponent,
    resolve: {
      itineraryActivity: ItineraryActivityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itineraryActivityRoute)],
  exports: [RouterModule],
})
export class ItineraryActivityRoutingModule {}

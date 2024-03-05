import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItineraryComponent } from '../list/itinerary.component';
import { ItineraryDetailComponent } from '../detail/itinerary-detail.component';
import { ItineraryUpdateComponent } from '../update/itinerary-update.component';
import { ItineraryRoutingResolveService } from './itinerary-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itineraryRoute: Routes = [
  {
    path: '',
    component: ItineraryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItineraryDetailComponent,
    resolve: {
      itinerary: ItineraryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItineraryUpdateComponent,
    resolve: {
      itinerary: ItineraryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItineraryUpdateComponent,
    resolve: {
      itinerary: ItineraryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itineraryRoute)],
  exports: [RouterModule],
})
export class ItineraryRoutingModule {}

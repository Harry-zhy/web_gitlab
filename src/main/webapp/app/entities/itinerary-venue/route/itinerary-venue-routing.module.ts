import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItineraryVenueComponent } from '../list/itinerary-venue.component';
import { ItineraryVenueDetailComponent } from '../detail/itinerary-venue-detail.component';
import { ItineraryVenueUpdateComponent } from '../update/itinerary-venue-update.component';
import { ItineraryVenueRoutingResolveService } from './itinerary-venue-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itineraryVenueRoute: Routes = [
  {
    path: '',
    component: ItineraryVenueComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItineraryVenueDetailComponent,
    resolve: {
      itineraryVenue: ItineraryVenueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItineraryVenueUpdateComponent,
    resolve: {
      itineraryVenue: ItineraryVenueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItineraryVenueUpdateComponent,
    resolve: {
      itineraryVenue: ItineraryVenueRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itineraryVenueRoute)],
  exports: [RouterModule],
})
export class ItineraryVenueRoutingModule {}

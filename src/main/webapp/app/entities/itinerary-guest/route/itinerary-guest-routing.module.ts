import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItineraryGuestComponent } from '../list/itinerary-guest.component';
import { ItineraryGuestDetailComponent } from '../detail/itinerary-guest-detail.component';
import { ItineraryGuestUpdateComponent } from '../update/itinerary-guest-update.component';
import { ItineraryGuestRoutingResolveService } from './itinerary-guest-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itineraryGuestRoute: Routes = [
  {
    path: '',
    component: ItineraryGuestComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItineraryGuestDetailComponent,
    resolve: {
      itineraryGuest: ItineraryGuestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItineraryGuestUpdateComponent,
    resolve: {
      itineraryGuest: ItineraryGuestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItineraryGuestUpdateComponent,
    resolve: {
      itineraryGuest: ItineraryGuestRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itineraryGuestRoute)],
  exports: [RouterModule],
})
export class ItineraryGuestRoutingModule {}

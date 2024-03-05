import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EventItineraryComponent } from '../list/event-itinerary.component';
import { EventItineraryDetailComponent } from '../detail/event-itinerary-detail.component';
import { EventItineraryUpdateComponent } from '../update/event-itinerary-update.component';
import { EventItineraryRoutingResolveService } from './event-itinerary-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const eventItineraryRoute: Routes = [
  {
    path: '',
    component: EventItineraryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EventItineraryDetailComponent,
    resolve: {
      eventItinerary: EventItineraryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EventItineraryUpdateComponent,
    resolve: {
      eventItinerary: EventItineraryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EventItineraryUpdateComponent,
    resolve: {
      eventItinerary: EventItineraryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(eventItineraryRoute)],
  exports: [RouterModule],
})
export class EventItineraryRoutingModule {}

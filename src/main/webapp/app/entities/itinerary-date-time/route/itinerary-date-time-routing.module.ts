import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItineraryDateTimeComponent } from '../list/itinerary-date-time.component';
import { ItineraryDateTimeDetailComponent } from '../detail/itinerary-date-time-detail.component';
import { ItineraryDateTimeUpdateComponent } from '../update/itinerary-date-time-update.component';
import { ItineraryDateTimeRoutingResolveService } from './itinerary-date-time-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itineraryDateTimeRoute: Routes = [
  {
    path: '',
    component: ItineraryDateTimeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItineraryDateTimeDetailComponent,
    resolve: {
      itineraryDateTime: ItineraryDateTimeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItineraryDateTimeUpdateComponent,
    resolve: {
      itineraryDateTime: ItineraryDateTimeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItineraryDateTimeUpdateComponent,
    resolve: {
      itineraryDateTime: ItineraryDateTimeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itineraryDateTimeRoute)],
  exports: [RouterModule],
})
export class ItineraryDateTimeRoutingModule {}

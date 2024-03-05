import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItineraryCatererComponent } from '../list/itinerary-caterer.component';
import { ItineraryCatererDetailComponent } from '../detail/itinerary-caterer-detail.component';
import { ItineraryCatererUpdateComponent } from '../update/itinerary-caterer-update.component';
import { ItineraryCatererRoutingResolveService } from './itinerary-caterer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const itineraryCatererRoute: Routes = [
  {
    path: '',
    component: ItineraryCatererComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ItineraryCatererDetailComponent,
    resolve: {
      itineraryCaterer: ItineraryCatererRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItineraryCatererUpdateComponent,
    resolve: {
      itineraryCaterer: ItineraryCatererRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItineraryCatererUpdateComponent,
    resolve: {
      itineraryCaterer: ItineraryCatererRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itineraryCatererRoute)],
  exports: [RouterModule],
})
export class ItineraryCatererRoutingModule {}

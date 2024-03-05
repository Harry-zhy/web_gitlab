import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VenueInformationComponent } from '../list/venue-information.component';
import { VenueInformationDetailComponent } from '../detail/venue-information-detail.component';
import { VenueInformationUpdateComponent } from '../update/venue-information-update.component';
import { VenueInformationRoutingResolveService } from './venue-information-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const venueInformationRoute: Routes = [
  {
    path: '',
    component: VenueInformationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VenueInformationDetailComponent,
    resolve: {
      venueInformation: VenueInformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VenueInformationUpdateComponent,
    resolve: {
      venueInformation: VenueInformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VenueInformationUpdateComponent,
    resolve: {
      venueInformation: VenueInformationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(venueInformationRoute)],
  exports: [RouterModule],
})
export class VenueInformationRoutingModule {}

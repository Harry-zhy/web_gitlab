import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MockVenueEntityComponent } from '../list/mock-venue-entity.component';
import { MockVenueEntityDetailComponent } from '../detail/mock-venue-entity-detail.component';
import { MockVenueEntityUpdateComponent } from '../update/mock-venue-entity-update.component';
import { MockVenueEntityRoutingResolveService } from './mock-venue-entity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mockVenueEntityRoute: Routes = [
  {
    path: '',
    component: MockVenueEntityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MockVenueEntityDetailComponent,
    resolve: {
      mockVenueEntity: MockVenueEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MockVenueEntityUpdateComponent,
    resolve: {
      mockVenueEntity: MockVenueEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MockVenueEntityUpdateComponent,
    resolve: {
      mockVenueEntity: MockVenueEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mockVenueEntityRoute)],
  exports: [RouterModule],
})
export class MockVenueEntityRoutingModule {}

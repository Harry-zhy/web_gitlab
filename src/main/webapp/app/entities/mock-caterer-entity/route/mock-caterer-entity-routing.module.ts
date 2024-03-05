import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MockCatererEntityComponent } from '../list/mock-caterer-entity.component';
import { MockCatererEntityDetailComponent } from '../detail/mock-caterer-entity-detail.component';
import { MockCatererEntityUpdateComponent } from '../update/mock-caterer-entity-update.component';
import { MockCatererEntityRoutingResolveService } from './mock-caterer-entity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mockCatererEntityRoute: Routes = [
  {
    path: '',
    component: MockCatererEntityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MockCatererEntityDetailComponent,
    resolve: {
      mockCatererEntity: MockCatererEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MockCatererEntityUpdateComponent,
    resolve: {
      mockCatererEntity: MockCatererEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MockCatererEntityUpdateComponent,
    resolve: {
      mockCatererEntity: MockCatererEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mockCatererEntityRoute)],
  exports: [RouterModule],
})
export class MockCatererEntityRoutingModule {}

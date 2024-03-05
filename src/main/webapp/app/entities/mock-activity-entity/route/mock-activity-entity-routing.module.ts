import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MockActivityEntityComponent } from '../list/mock-activity-entity.component';
import { MockActivityEntityDetailComponent } from '../detail/mock-activity-entity-detail.component';
import { MockActivityEntityUpdateComponent } from '../update/mock-activity-entity-update.component';
import { MockActivityEntityRoutingResolveService } from './mock-activity-entity-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const mockActivityEntityRoute: Routes = [
  {
    path: '',
    component: MockActivityEntityComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MockActivityEntityDetailComponent,
    resolve: {
      mockActivityEntity: MockActivityEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MockActivityEntityUpdateComponent,
    resolve: {
      mockActivityEntity: MockActivityEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MockActivityEntityUpdateComponent,
    resolve: {
      mockActivityEntity: MockActivityEntityRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mockActivityEntityRoute)],
  exports: [RouterModule],
})
export class MockActivityEntityRoutingModule {}

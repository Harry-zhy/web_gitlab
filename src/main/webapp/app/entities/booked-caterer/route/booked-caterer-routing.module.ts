import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookedCatererComponent } from '../list/booked-caterer.component';
import { BookedCatererDetailComponent } from '../detail/booked-caterer-detail.component';
import { BookedCatererUpdateComponent } from '../update/booked-caterer-update.component';
import { BookedCatererRoutingResolveService } from './booked-caterer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const bookedCatererRoute: Routes = [
  {
    path: '',
    component: BookedCatererComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookedCatererDetailComponent,
    resolve: {
      bookedCaterer: BookedCatererRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookedCatererUpdateComponent,
    resolve: {
      bookedCaterer: BookedCatererRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookedCatererUpdateComponent,
    resolve: {
      bookedCaterer: BookedCatererRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookedCatererRoute)],
  exports: [RouterModule],
})
export class BookedCatererRoutingModule {}

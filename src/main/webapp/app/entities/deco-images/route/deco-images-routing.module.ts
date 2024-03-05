import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DecoImagesComponent } from '../list/deco-images.component';
import { DecoImagesDetailComponent } from '../detail/deco-images-detail.component';
import { DecoImagesUpdateComponent } from '../update/deco-images-update.component';
import { DecoImagesRoutingResolveService } from './deco-images-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const decoImagesRoute: Routes = [
  {
    path: '',
    component: DecoImagesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DecoImagesDetailComponent,
    resolve: {
      decoImages: DecoImagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DecoImagesUpdateComponent,
    resolve: {
      decoImages: DecoImagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DecoImagesUpdateComponent,
    resolve: {
      decoImages: DecoImagesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(decoImagesRoute)],
  exports: [RouterModule],
})
export class DecoImagesRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FavouritesListItemComponent } from '../list/favourites-list-item.component';
import { FavouritesListItemDetailComponent } from '../detail/favourites-list-item-detail.component';
import { FavouritesListItemUpdateComponent } from '../update/favourites-list-item-update.component';
import { FavouritesListItemRoutingResolveService } from './favourites-list-item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const favouritesListItemRoute: Routes = [
  {
    path: '',
    component: FavouritesListItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FavouritesListItemDetailComponent,
    resolve: {
      favouritesListItem: FavouritesListItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FavouritesListItemUpdateComponent,
    resolve: {
      favouritesListItem: FavouritesListItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FavouritesListItemUpdateComponent,
    resolve: {
      favouritesListItem: FavouritesListItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(favouritesListItemRoute)],
  exports: [RouterModule],
})
export class FavouritesListItemRoutingModule {}

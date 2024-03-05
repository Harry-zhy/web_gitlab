import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FavouritesListItemComponent } from './list/favourites-list-item.component';
import { FavouritesListItemDetailComponent } from './detail/favourites-list-item-detail.component';
import { FavouritesListItemUpdateComponent } from './update/favourites-list-item-update.component';
import { FavouritesListItemDeleteDialogComponent } from './delete/favourites-list-item-delete-dialog.component';
import { FavouritesListItemRoutingModule } from './route/favourites-list-item-routing.module';

@NgModule({
  imports: [SharedModule, FavouritesListItemRoutingModule],
  declarations: [
    FavouritesListItemComponent,
    FavouritesListItemDetailComponent,
    FavouritesListItemUpdateComponent,
    FavouritesListItemDeleteDialogComponent,
  ],
})
export class FavouritesListItemModule {}

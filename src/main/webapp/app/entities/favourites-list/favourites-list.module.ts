import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FavouritesListComponent } from './list/favourites-list.component';
import { FavouritesListDetailComponent } from './detail/favourites-list-detail.component';
import { FavouritesListUpdateComponent } from './update/favourites-list-update.component';
import { FavouritesListDeleteDialogComponent } from './delete/favourites-list-delete-dialog.component';
import { FavouritesListRoutingModule } from './route/favourites-list-routing.module';

@NgModule({
  imports: [SharedModule, FavouritesListRoutingModule],
  declarations: [
    FavouritesListComponent,
    FavouritesListDetailComponent,
    FavouritesListUpdateComponent,
    FavouritesListDeleteDialogComponent,
  ],
})
export class FavouritesListModule {}

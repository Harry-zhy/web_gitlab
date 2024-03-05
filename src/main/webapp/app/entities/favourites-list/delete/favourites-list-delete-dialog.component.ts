import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFavouritesList } from '../favourites-list.model';
import { FavouritesListService } from '../service/favourites-list.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './favourites-list-delete-dialog.component.html',
})
export class FavouritesListDeleteDialogComponent {
  favouritesList?: IFavouritesList;

  constructor(protected favouritesListService: FavouritesListService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.favouritesListService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

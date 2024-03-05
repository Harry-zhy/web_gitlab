import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFavouritesListItem } from '../favourites-list-item.model';
import { FavouritesListItemService } from '../service/favourites-list-item.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './favourites-list-item-delete-dialog.component.html',
})
export class FavouritesListItemDeleteDialogComponent {
  favouritesListItem?: IFavouritesListItem;

  constructor(protected favouritesListItemService: FavouritesListItemService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.favouritesListItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

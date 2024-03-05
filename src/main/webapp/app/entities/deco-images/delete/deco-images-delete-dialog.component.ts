import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoImages } from '../deco-images.model';
import { DecoImagesService } from '../service/deco-images.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-images-delete-dialog.component.html',
})
export class DecoImagesDeleteDialogComponent {
  decoImages?: IDecoImages;

  constructor(protected decoImagesService: DecoImagesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoImagesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

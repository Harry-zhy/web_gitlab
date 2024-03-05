import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoThemes } from '../deco-themes.model';
import { DecoThemesService } from '../service/deco-themes.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-themes-delete-dialog.component.html',
})
export class DecoThemesDeleteDialogComponent {
  decoThemes?: IDecoThemes;

  constructor(protected decoThemesService: DecoThemesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoThemesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

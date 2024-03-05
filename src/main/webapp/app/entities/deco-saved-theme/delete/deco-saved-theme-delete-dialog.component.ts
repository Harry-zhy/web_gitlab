import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDecoSavedTheme } from '../deco-saved-theme.model';
import { DecoSavedThemeService } from '../service/deco-saved-theme.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './deco-saved-theme-delete-dialog.component.html',
})
export class DecoSavedThemeDeleteDialogComponent {
  decoSavedTheme?: IDecoSavedTheme;

  constructor(protected decoSavedThemeService: DecoSavedThemeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.decoSavedThemeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

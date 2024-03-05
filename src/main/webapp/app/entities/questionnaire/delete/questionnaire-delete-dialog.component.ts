import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuestionnaire } from '../questionnaire.model';
import { QuestionnaireService } from '../service/questionnaire.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './questionnaire-delete-dialog.component.html',
})
export class QuestionnaireDeleteDialogComponent {
  questionnaire?: IQuestionnaire;

  constructor(protected questionnaireService: QuestionnaireService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.questionnaireService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}

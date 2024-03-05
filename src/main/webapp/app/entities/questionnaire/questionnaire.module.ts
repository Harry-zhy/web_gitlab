import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { QuestionnaireComponent } from './list/questionnaire.component';
import { QuestionnaireDetailComponent } from './detail/questionnaire-detail.component';
import { QuestionnaireUpdateComponent } from './update/questionnaire-update.component';
import { QuestionnaireDeleteDialogComponent } from './delete/questionnaire-delete-dialog.component';
import { QuestionnaireRoutingModule } from './route/questionnaire-routing.module';

@NgModule({
  imports: [SharedModule, QuestionnaireRoutingModule],
  declarations: [QuestionnaireComponent, QuestionnaireDetailComponent, QuestionnaireUpdateComponent, QuestionnaireDeleteDialogComponent],
})
export class QuestionnaireModule {}

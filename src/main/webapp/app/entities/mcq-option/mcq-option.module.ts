import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MCQOptionComponent } from './list/mcq-option.component';
import { MCQOptionDetailComponent } from './detail/mcq-option-detail.component';
import { MCQOptionUpdateComponent } from './update/mcq-option-update.component';
import { MCQOptionDeleteDialogComponent } from './delete/mcq-option-delete-dialog.component';
import { MCQOptionRoutingModule } from './route/mcq-option-routing.module';

@NgModule({
  imports: [SharedModule, MCQOptionRoutingModule],
  declarations: [MCQOptionComponent, MCQOptionDetailComponent, MCQOptionUpdateComponent, MCQOptionDeleteDialogComponent],
})
export class MCQOptionModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DietaryRequirementsComponent } from './list/dietary-requirements.component';
import { DietaryRequirementsDetailComponent } from './detail/dietary-requirements-detail.component';
import { DietaryRequirementsUpdateComponent } from './update/dietary-requirements-update.component';
import { DietaryRequirementsDeleteDialogComponent } from './delete/dietary-requirements-delete-dialog.component';
import { DietaryRequirementsRoutingModule } from './route/dietary-requirements-routing.module';

@NgModule({
  imports: [SharedModule, DietaryRequirementsRoutingModule],
  declarations: [
    DietaryRequirementsComponent,
    DietaryRequirementsDetailComponent,
    DietaryRequirementsUpdateComponent,
    DietaryRequirementsDeleteDialogComponent,
  ],
})
export class DietaryRequirementsModule {}

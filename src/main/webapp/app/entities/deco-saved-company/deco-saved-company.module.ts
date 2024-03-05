import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoSavedCompanyComponent } from './list/deco-saved-company.component';
import { DecoSavedCompanyDetailComponent } from './detail/deco-saved-company-detail.component';
import { DecoSavedCompanyUpdateComponent } from './update/deco-saved-company-update.component';
import { DecoSavedCompanyDeleteDialogComponent } from './delete/deco-saved-company-delete-dialog.component';
import { DecoSavedCompanyRoutingModule } from './route/deco-saved-company-routing.module';

@NgModule({
  imports: [SharedModule, DecoSavedCompanyRoutingModule],
  declarations: [
    DecoSavedCompanyComponent,
    DecoSavedCompanyDetailComponent,
    DecoSavedCompanyUpdateComponent,
    DecoSavedCompanyDeleteDialogComponent,
  ],
})
export class DecoSavedCompanyModule {}

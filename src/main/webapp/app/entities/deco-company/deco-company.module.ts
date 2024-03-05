import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoCompanyComponent } from './list/deco-company.component';
import { DecoCompanyDetailComponent } from './detail/deco-company-detail.component';
import { DecoCompanyUpdateComponent } from './update/deco-company-update.component';
import { DecoCompanyDeleteDialogComponent } from './delete/deco-company-delete-dialog.component';
import { DecoCompanyRoutingModule } from './route/deco-company-routing.module';

@NgModule({
  imports: [SharedModule, DecoCompanyRoutingModule],
  declarations: [DecoCompanyComponent, DecoCompanyDetailComponent, DecoCompanyUpdateComponent, DecoCompanyDeleteDialogComponent],
})
export class DecoCompanyModule {}

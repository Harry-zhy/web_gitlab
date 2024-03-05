import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CaterersComponent } from './list/caterers.component';
import { CaterersDetailComponent } from './detail/caterers-detail.component';
import { CaterersUpdateComponent } from './update/caterers-update.component';
import { CaterersDeleteDialogComponent } from './delete/caterers-delete-dialog.component';
import { CaterersRoutingModule } from './route/caterers-routing.module';

@NgModule({
  imports: [SharedModule, CaterersRoutingModule],
  declarations: [CaterersComponent, CaterersDetailComponent, CaterersUpdateComponent, CaterersDeleteDialogComponent],
})
export class CaterersModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoThemesComponent } from './list/deco-themes.component';
import { DecoThemesDetailComponent } from './detail/deco-themes-detail.component';
import { DecoThemesUpdateComponent } from './update/deco-themes-update.component';
import { DecoThemesDeleteDialogComponent } from './delete/deco-themes-delete-dialog.component';
import { DecoThemesRoutingModule } from './route/deco-themes-routing.module';

@NgModule({
  imports: [SharedModule, DecoThemesRoutingModule],
  declarations: [DecoThemesComponent, DecoThemesDetailComponent, DecoThemesUpdateComponent, DecoThemesDeleteDialogComponent],
})
export class DecoThemesModule {}

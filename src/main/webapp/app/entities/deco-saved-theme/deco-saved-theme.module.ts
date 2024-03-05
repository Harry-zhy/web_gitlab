import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoSavedThemeComponent } from './list/deco-saved-theme.component';
import { DecoSavedThemeDetailComponent } from './detail/deco-saved-theme-detail.component';
import { DecoSavedThemeUpdateComponent } from './update/deco-saved-theme-update.component';
import { DecoSavedThemeDeleteDialogComponent } from './delete/deco-saved-theme-delete-dialog.component';
import { DecoSavedThemeRoutingModule } from './route/deco-saved-theme-routing.module';

@NgModule({
  imports: [SharedModule, DecoSavedThemeRoutingModule],
  declarations: [
    DecoSavedThemeComponent,
    DecoSavedThemeDetailComponent,
    DecoSavedThemeUpdateComponent,
    DecoSavedThemeDeleteDialogComponent,
  ],
})
export class DecoSavedThemeModule {}

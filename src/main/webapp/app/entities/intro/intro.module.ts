import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { IntroComponent } from './list/intro.component';
import { IntroDetailComponent } from './detail/intro-detail.component';
import { IntroUpdateComponent } from './update/intro-update.component';
import { IntroDeleteDialogComponent } from './delete/intro-delete-dialog.component';
import { IntroRoutingModule } from './route/intro-routing.module';

@NgModule({
  imports: [SharedModule, IntroRoutingModule],
  declarations: [IntroComponent, IntroDetailComponent, IntroUpdateComponent, IntroDeleteDialogComponent],
})
export class IntroModule {}

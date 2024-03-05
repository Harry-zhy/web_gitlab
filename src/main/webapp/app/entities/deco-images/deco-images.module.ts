import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DecoImagesComponent } from './list/deco-images.component';
import { DecoImagesDetailComponent } from './detail/deco-images-detail.component';
import { DecoImagesUpdateComponent } from './update/deco-images-update.component';
import { DecoImagesDeleteDialogComponent } from './delete/deco-images-delete-dialog.component';
import { DecoImagesRoutingModule } from './route/deco-images-routing.module';

@NgModule({
  imports: [SharedModule, DecoImagesRoutingModule],
  declarations: [DecoImagesComponent, DecoImagesDetailComponent, DecoImagesUpdateComponent, DecoImagesDeleteDialogComponent],
})
export class DecoImagesModule {}

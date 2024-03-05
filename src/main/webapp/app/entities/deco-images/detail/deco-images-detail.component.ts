import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoImages } from '../deco-images.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-deco-images-detail',
  templateUrl: './deco-images-detail.component.html',
})
export class DecoImagesDetailComponent implements OnInit {
  decoImages: IDecoImages | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoImages }) => {
      this.decoImages = decoImages;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IActivityImage } from '../activity-image.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-activity-image-detail',
  templateUrl: './activity-image-detail.component.html',
})
export class ActivityImageDetailComponent implements OnInit {
  activityImage: IActivityImage | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ activityImage }) => {
      this.activityImage = activityImage;
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

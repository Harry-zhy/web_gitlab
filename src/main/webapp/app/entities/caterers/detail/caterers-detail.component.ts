import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICaterers } from '../caterers.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-caterers-detail',
  templateUrl: './caterers-detail.component.html',
})
export class CaterersDetailComponent implements OnInit {
  caterers: ICaterers | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caterers }) => {
      this.caterers = caterers;
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

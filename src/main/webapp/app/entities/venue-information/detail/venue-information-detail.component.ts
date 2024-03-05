import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVenueInformation } from '../venue-information.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-venue-information-detail',
  templateUrl: './venue-information-detail.component.html',
})
export class VenueInformationDetailComponent implements OnInit {
  venueInformation: IVenueInformation | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venueInformation }) => {
      this.venueInformation = venueInformation;
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

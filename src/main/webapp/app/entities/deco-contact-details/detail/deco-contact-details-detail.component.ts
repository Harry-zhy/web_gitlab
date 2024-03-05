import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDecoContactDetails } from '../deco-contact-details.model';

@Component({
  selector: 'jhi-deco-contact-details-detail',
  templateUrl: './deco-contact-details-detail.component.html',
})
export class DecoContactDetailsDetailComponent implements OnInit {
  decoContactDetails: IDecoContactDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ decoContactDetails }) => {
      this.decoContactDetails = decoContactDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

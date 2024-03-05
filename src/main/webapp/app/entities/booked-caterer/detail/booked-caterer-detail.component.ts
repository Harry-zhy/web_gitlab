import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookedCaterer } from '../booked-caterer.model';

@Component({
  selector: 'jhi-booked-caterer-detail',
  templateUrl: './booked-caterer-detail.component.html',
})
export class BookedCatererDetailComponent implements OnInit {
  bookedCaterer: IBookedCaterer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookedCaterer }) => {
      this.bookedCaterer = bookedCaterer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

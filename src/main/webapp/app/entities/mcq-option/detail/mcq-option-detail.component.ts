import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMCQOption } from '../mcq-option.model';

@Component({
  selector: 'jhi-mcq-option-detail',
  templateUrl: './mcq-option-detail.component.html',
})
export class MCQOptionDetailComponent implements OnInit {
  mCQOption: IMCQOption | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mCQOption }) => {
      this.mCQOption = mCQOption;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIntro } from '../intro.model';

@Component({
  selector: 'jhi-intro-detail',
  templateUrl: './intro-detail.component.html',
})
export class IntroDetailComponent implements OnInit {
  intro: IIntro | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ intro }) => {
      this.intro = intro;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

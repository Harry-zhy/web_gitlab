import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  constructor() {}
  ngOnInit() {
    this.selectedValue = 0;
  }

  feedbacks: any[] = [];
  addFeedback() {
    this.feedbacks.push({});
  }

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;

  countStar(star: number) {
    this.selectedValue = star;
    console.log('Value of star', star);
  }
}

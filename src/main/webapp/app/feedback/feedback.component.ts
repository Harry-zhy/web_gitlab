import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    this.selectedValue = 0;
  }

  feedbacks: any[] = [];
  addFeedback() {
    this.feedbacks.push({ text: '' });
  }

  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number = 0;

  countStar(star: number) {
    this.selectedValue = star;
    console.log('Value of star', star);
  }

  deteleFeedback(feedback: any) {
    const index = this.feedbacks.indexOf(feedback);
    if (index !== -1) {
      this.feedbacks.splice(index, 1);
    }
  }

  switchToQuestionnaire() {
    this.router.navigate(['/questionnaire']);
  }

  sendToUs() {
    this.router.navigate(['/success']);
  }

  isSendButtonEnabled() {
    return this.selectedValue > 0;
  }

  showQuestionnaire: boolean = false;
  isFeedbackVisible = true;
  isSvgVisible = true;
  toggleQuestionnaire() {
    this.isFeedbackVisible = !this.isFeedbackVisible;
    this.isSvgVisible = !this.isSvgVisible;
  }
}

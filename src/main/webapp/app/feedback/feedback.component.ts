import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IQuestion } from '../entities/question/question.model';
import { IMCQOption } from '../entities/mcq-option/mcq-option.model';
import { IIntro } from '../entities/intro/intro.model';
import { QuesType } from '../entities/enumerations/ques-type.model';

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    this.selectedValue = 0;
    this.loadIntro();
    this.loadQuestions();
    this.loadMCQOptions();
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.currentQuestionIndex = this.isIntro ? -1 : 0;
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

  deleteFeedback(feedback: any) {
    const index = this.feedbacks.indexOf(feedback);
    if (index !== -1) {
      this.feedbacks.splice(index, 1);
    }
  }

  sendToUs() {
    this.router.navigate(['/success']);
  }

  isSendButtonEnabled() {
    return this.selectedValue > 0;
  }

  isFeedbackVisible = true;
  isSvgVisible = true;
  toggleQuestionnaire() {
    this.isFeedbackVisible = !this.isFeedbackVisible;
    this.isSvgVisible = !this.isSvgVisible;
  }

  introData: IIntro | null = null;
  questions: IQuestion[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: IQuestion | null = null;
  isIntro: boolean = true;
  mcqOptions: IMCQOption[] = [];
  userSelections: { [key: number]: number } = {};

  loadIntro() {
    // Load intro data from backend or define it here
    this.introData = {
      id: 1,
      title: 'FeedBack Questionnaire',
      salutation: 'Dear User',
      body: 'Thank you for choosing to participate in our event. We value your feedback to help us improve our service quality and user experience. We would appreciate it if you could take a few minutes to fill out the following questionnaire!',
    };
  }

  loadQuestions() {
    // Load questions from backend or define them here
    this.questions = [
      { id: 1, question: 'Question 1', quesType: QuesType.MULTI_CHOICE },
      { id: 2, question: 'Question 2', quesType: QuesType.FILL_IN },
      { id: 3, question: 'Question 3', quesType: QuesType.MULTI_CHOICE },
      // Add more questions here
    ];
  }

  loadMCQOptions() {
    // Load multiple choice options from backend or define them here
    this.mcqOptions = [
      { id: 1, value: 'Option 1', question: this.questions[0] },
      { id: 2, value: 'Option 2', question: this.questions[0] },
      { id: 3, value: 'Option 3', question: this.questions[0] },
      // Add more options here
    ];
  }
  nextQuestion() {
    if (this.isIntro) {
      // If currently in the intro section, move to the first question
      this.isIntro = false;
      this.currentQuestion = this.questions[0];
      this.currentQuestionIndex = 0;
    } else {
      // If not in the intro section, move to the next question
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
      } else {
        // Optionally, handle the end of questions
        console.log('End of questions.');
      }
    }
    // Update the question number display
    this.updateQuestionNumber();
    // Optionally, log user selections for debugging
    console.log('User Selections:', this.userSelections);
  }

  updateQuestionNumber() {
    return this.currentQuestionIndex + 1;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
    }
  }

  atEndOfQuestions(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  atFrontOfQuestions() {
    return this.currentQuestionIndex < 1;
  }

  protected readonly QuesType = QuesType;
  userFillInAnswer: any;
}

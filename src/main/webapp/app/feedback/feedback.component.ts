import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IQuestion } from '../entities/question/question.model';
import { IMCQOption } from '../entities/mcq-option/mcq-option.model';
import { IIntro } from '../entities/intro/intro.model';
import { QuesType } from '../entities/enumerations/ques-type.model';
import { QuestionService } from '../entities/question/service/question.service';
import { IntroService } from '../entities/intro/service/intro.service';
import { UserService } from '../entities/user/user.service';
import { MCQOptionService } from '../entities/mcq-option/service/mcq-option.service';
import { FeedbackSuccessComponent } from './feedback-success/feedback-success.component';

@Component({
  selector: 'jhi-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  constructor(
    private router: Router,
    protected questionService: QuestionService,
    protected introService: IntroService,
    protected userService: UserService,
    protected mcqOptionService: MCQOptionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadIntro();
    await this.getUsername();
    await this.loadQuestions();
    await this.loadMCQOptions();
    this.selectedValue = 0;
    this.currentQuestion = this.questions[this.currentQuestionIndex];
    this.currentQuestionIndex = this.isIntro ? -1 : 0;
  }

  // ngOnInit() {
  //   this.getUsername2();
  //   this.loadIntro2();
  //   this.loadQuestions2();
  //   this.loadMCQOptions2();
  //   this.selectedValue = 0;
  //   this.currentQuestion = this.questions[this.currentQuestionIndex];
  //   this.currentQuestionIndex = this.isIntro ? -1 : 0;
  // }

  getUsername2() {
    this.userService.getCurrentUsername().subscribe(data => {
      this.currentUserUsername = data;
    });
  }

  loadIntro2() {
    this.introService.query().subscribe(data => {
      //@ts-ignore
      this.introData = data.body;
    });
  }

  loadQuestions2() {
    this.questionService.query().subscribe(data => {
      //@ts-ignore
      this.questions = data.body;
    });
  }

  loadMCQOptions2() {
    this.mcqOptionService.query().subscribe(data => {
      //@ts-ignore
      this.mcqOptions = data.body;
    });
  }

  feedbacks: any[] = [];
  addFeedback() {
    this.feedbacks.push({ text: '' });
    setTimeout(() => {
      const feedbackItems = document.querySelectorAll('.feedbackItem');
      feedbackItems[feedbackItems.length - 1].classList.add('show');
    }, 0);
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
    this.router.navigate(['feedback-success']);
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
  protected currentUserUsername: string = '';

  async loadIntro() {
    const data = await this.introService.query().toPromise();
    // @ts-ignore
    this.introData = data?.body.at(0);
  }

  async getUsername() {
    const data = await this.userService.getCurrentUsername().toPromise();
    //@ts-ignore
    this.currentUserUsername = data;
  }

  async loadQuestions() {
    try {
      const data = await this.questionService.query().toPromise();
      // @ts-ignore
      if (data.body !== null) {
        // @ts-ignore
        this.questions = data.body;
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }

  async loadMCQOptions() {
    try {
      const data = await this.mcqOptionService.query().toPromise();
      // @ts-ignore
      if (data.body !== null) {
        // @ts-ignore
        this.mcqOptions = data.body;
      }
    } catch (error) {
      console.error('Error loading options:', error);
    }
  }

  nextQuestion() {
    if (this.isIntro) {
      this.isIntro = false;
      this.currentQuestion = this.questions[0];
      this.currentQuestionIndex = 0;
    } else {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.currentQuestion = this.questions[this.currentQuestionIndex];
      } else {
        console.log('End of questions.');
      }
    }
    this.updateQuestionNumber();
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

  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  triggerFileInputClick() {
    // @ts-ignore
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
  }
}

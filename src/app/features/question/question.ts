import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Header } from "../../shared/layout/header/header";
import { AnswerOptions, AppRoutes } from '../../core/enums/core.enums';
import { MAX_QUESTIONS } from '../../core/utils/consts';
import { ScoreService } from '../../core/service/score.service';
import { DataService } from '../../core/service/data.service';
import { Router } from '@angular/router';
import { Button, ButtonColor } from "../../shared/ui/button/button";
import { InnerLayout } from "../../shared/inner-layout/inner-layout";
import { LoaderComponent } from "../../shared/ui/loader/loader/loader";

const FIRST_QUESTION_NUM = 1;

@Component({
  selector: 'app-question',
  imports: [Header, Button, InnerLayout, LoaderComponent],
  templateUrl: './question.html',
  styleUrl: './question.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Question {
  public isLoading: WritableSignal<boolean> = signal(false);
  public questionNum: WritableSignal<number> = signal(FIRST_QUESTION_NUM);
  public question: WritableSignal<string | undefined> = signal(undefined);
  public answer: WritableSignal<string | undefined> = signal(undefined);
  public showAnswer: WritableSignal<boolean> = signal(false);

  public readonly answerOptions = AnswerOptions;
  public readonly buttonColor = ButtonColor;

  constructor(
    private scoreService: ScoreService,
    private dataService: DataService,
    private router: Router
  ) {
    this.scoreService.startTimer();
    this.updateQuestion();
  }

  private updateQuestion() {
    this.isLoading.set(true);
    this.dataService.getQuestionById(this.questionNum()).subscribe((data) => {
      this.question.set(data?.question);
      this.answer.set(undefined);
      this.isLoading.set(false);
    });
  }

  private onComplete() {
    this.scoreService.stopTimer();
    this.scoreService.saveScore()
    .subscribe(() => this.router.navigate([`/${AppRoutes.Review}`]));
  }

  private setNextQuestion() {
    this.questionNum.update(count => count + 1);
    this.showAnswer.set(false);
    this.updateQuestion();
  }

  public showCorrectAnswer(): void {
    this.isLoading.set(true);
    this.dataService.getAnswerById(this.questionNum()).subscribe((data) => {
      this.question.set(undefined);
      this.answer.set(data?.answer);
      this.showAnswer.set(true);
      this.isLoading.set(false);
    });
  }

  public onNextQuestion(answer: AnswerOptions): void {
    this.scoreService.addScore(answer);

    if (this.questionNum() >= MAX_QUESTIONS) {
      this.onComplete();
    } else {
      this.setNextQuestion();
    }
  }
}

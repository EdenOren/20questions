import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Header } from "../../shared/layout/header/header";
import { AnswerOptions, AppRoutes } from '../../core/enums/core.enums';
import { MAX_QUESTIONS } from '../../core/utils/consts';
import { ScoreService } from '../../core/service/score.service';
import { DataService } from '../../core/service/data.service';
import { Router } from '@angular/router';
import { Button, ButtonColor } from "../../shared/ui/button/button";
import { InnerLayout } from "../../shared/inner-layout/inner-layout";

@Component({
  selector: 'app-question',
  imports: [Header, Button, InnerLayout],
  templateUrl: './question.html',
  styleUrl: './question.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Question {
  public questionCount: WritableSignal<number> = signal(1);
  public question: WritableSignal<string | undefined> = signal(undefined);
  public answer: WritableSignal<string | undefined> = signal(undefined);
  public showAnswer: WritableSignal<boolean> = signal(false);

  public answerOptions = AnswerOptions;
  public buttonColor = ButtonColor;

  constructor(
    private scoreService: ScoreService,
    private dataService: DataService,
    private router: Router
  ) {
    this.scoreService.startTimer();
    this.updateQuestion();
  }

  private updateQuestion() {
    this.dataService.getQuestionById(this.questionCount()).subscribe((data) => {
      this.question.set(data?.question);
      this.answer.set(undefined);
    });
  }

  private onComplete() {
    this.scoreService.stopTimer();
    this.scoreService.saveScore()
    .subscribe(() => this.router.navigate([`/${AppRoutes.Review}`]));
  }

  private setNextQuestion() {
    this.questionCount.update(count => count + 1);
    this.showAnswer.set(false);
    this.updateQuestion();
  }

  public showCorrectAnswer(): void {
    this.dataService.getAnswerById(this.questionCount()).subscribe((data) => {
      this.question.set(undefined);
      this.answer.set(data?.answer);
      this.showAnswer.set(true);
    });
  }

  public onNextQuestion(answer: AnswerOptions): void {
    this.scoreService.addScore(answer);

    if (this.questionCount() >= 1) {
      this.onComplete();
    } else {
      this.setNextQuestion();
    }
  }
}

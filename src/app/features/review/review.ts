import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { Header } from '../../shared/layout/header/header';
import { InnerLayout } from "../../shared/inner-layout/inner-layout";
import { ScoreService } from '../../core/service/score.service';
import { Rank, Score } from '../../core/models/core.model';
import { Button } from '../../shared/ui/button/button';
import { Router } from '@angular/router';
import { AppRoutes } from '../../core/enums/core.enums';

@Component({
  selector: 'app-review',
  imports: [Header, InnerLayout, Button],
  templateUrl: './review.html',
  styleUrl: './review.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Review {
  public score: WritableSignal<Score | undefined> = signal<Score | undefined>(undefined);
  public ranking: WritableSignal<Rank | undefined> = signal<Rank | undefined>(undefined);

  constructor(private scoreService: ScoreService, private router: Router) {
    this.setReviewData();
  }

  private setReviewData(): void {
    const score: Score | undefined = this.scoreService.getScore();
    this.score.set(score);
    if (score) {
    this.scoreService.getRanking(score)
      .subscribe((rank) => {
        this.ranking.set(rank);
      });
    }
  }

  public retry(): void {
    this.router.navigate([`/${AppRoutes.Home}`]);
  }
}

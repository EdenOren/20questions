import { Injectable, signal, WritableSignal } from '@angular/core';
import { Rank, Score } from '../models/core.model';
import { SupabaseService } from './supabase.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {
  private score: WritableSignal<Score | undefined> = signal<Score | undefined>(undefined);
  private points: WritableSignal<number> = signal<number>(0);
  private startTime: number = 0;
  private endTime: number = 0;

  constructor(private supabaseService: SupabaseService) { }

  public startTimer(): void {
    this.startTime = Date.now();
    this.endTime = 0;
  }

  public stopTimer(): void {
    this.endTime = Date.now();
  }

  public getScore(): Score | undefined {
    return this.score();
  }

  public addScore(score: number): void {
    this.points.update(currentScore => currentScore + score);
  }

  public saveScore(): Observable<boolean> {
    const time: string = ((this.endTime - this.startTime) / 1000 / 60).toFixed(2);
    this.score.set({
      score: this.points(),
      time: parseFloat(time)
    });
    if (this.score()) {
      return this.supabaseService.saveScore(this.score()!);
    }
    return of(false);
  }

  public getRanking(userScore: Score): Observable<Rank> {
    return this.supabaseService.getMyRanking(userScore);
  }
}

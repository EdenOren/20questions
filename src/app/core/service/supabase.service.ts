import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';
import { Question, Rank, Score } from '../models/core.model';
import { Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

public getQuestion(id: number): Observable<Omit<Question, 'answer'> | null> {
    return from(
      this.supabase
        .from('questions_for_frontend')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching question:', error);
          return null;
        }
        return data || [];
      }),
      catchError(err => {
        console.error('Unexpected error fetching question:', err);
        return of(null);
      })
    );
  }

  public getAnswer(id: number): Observable<Omit<Question, 'question'> | null> {
    return from(
      this.supabase
        .from('answers_for_frontend')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching questions:', error);
          return null;
        }
        return data || [];
      }),
      catchError(err => {
        console.error('Unexpected error fetching questions:', err);
        return of(null);
      })
    );
  }

  public saveScore(score: Score): Observable<boolean> {
    return from(
      this.supabase
        .from('scores')
        .insert([score])
    ).pipe(
      map(({ error }) => {
        if (error) {
          console.error('Error saving score:', error);
          return false;
        }
        return true;
      }),
      catchError(err => {
        console.error('Unexpected error saving score:', err);
        return of(false);
      })
    );
  }

  public getMyRanking(userScore: Score): Observable<Rank> {
    return from(
      this.supabase
        .from('scores')
        .select('id, score, time')
        .order('score', { ascending: false })
        .order('time', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          console.error('Error fetching scores:', error);
          return {
            rank: 1,
            total_players: 1
          };
        }

        const totalPlayers = data.length;

        let rank: number = 1;
        for (const entry of data) {
            if (
                entry.score > userScore.score || 
                (entry.score === userScore.score && entry.time < userScore.time)
            ) {
                rank++;
            }
        }

        return {
          rank,
          total_players: totalPlayers
        };
      }),
      catchError(err => {
        console.error('Unexpected error getting ranking:', err);
        return of({
          rank: 1,
          total_players: 1
        });
      })
    );
  }
}
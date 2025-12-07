import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';
import { Question, Rank, Score } from '../models/core.model';
import { Observable, from, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // ms

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  /**
   * Fetches a question by ID with automatic retries
   * Returns whatever data is available, even if partial
   */
  public getQuestion(id: number): Observable<Omit<Question, 'answer'> | null> {
    return from(
      this.supabase
        .from('questions_for_frontend')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: this.RETRY_DELAY
      }),
      map(({ data, error }) => {
        if (error) {
          console.error(`Error fetching question ${id}:`, error.message);
        }
        // Return whatever we got, even if there was an error
        return data || null;
      }),
      catchError(err => {
        console.error(`All retries failed for question ${id}:`, err);
        // Return null but don't block
        return of(null);
      })
    );
  }

  /**
   * Fetches an answer by ID with automatic retries
   * Returns whatever data is available, even if partial
   */
  public getAnswer(id: number): Observable<Omit<Question, 'question'> | null> {
    return from(
      this.supabase
        .from('answers_for_frontend')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: this.RETRY_DELAY
      }),
      map(({ data, error }) => {
        if (error) {
          console.error(`Error fetching answer ${id}:`, error.message);
        }
        // Return whatever we got, even if there was an error
        return data || null;
      }),
      catchError(err => {
        console.error(`All retries failed for answer ${id}:`, err);
        // Return null but don't block
        return of(null);
      })
    );
  }

  /**
   * Saves a score with automatic retries
   * Always returns true to prevent blocking the user experience
   */
  public saveScore(score: Score): Observable<boolean> {
    return from(
      this.supabase
        .from('scores')
        .insert([score])
    ).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: this.RETRY_DELAY
      }),
      map(({ error }) => {
        if (error) {
          console.error('Error saving score (non-blocking):', error.message);
          // Still return true - we don't want to block the user
        }
        return true;
      }),
      catchError(err => {
        console.error('All retries failed saving score (non-blocking):', err);
        // Always return true to prevent blocking user flow
        return of(true);
      })
    );
  }

  /**
   * Gets user ranking with graceful handling
   * Returns best available data, even if incomplete
   */
  public getMyRanking(userScore: Score): Observable<Rank> {
    return from(
      this.supabase
        .from('scores')
        .select('id, score, time')
        .order('score', { ascending: false })
        .order('time', { ascending: true })
    ).pipe(
      retry({
        count: this.MAX_RETRIES,
        delay: this.RETRY_DELAY
      }),
      map(({ data, error }) => {
        if (error) {
          console.error('Error fetching scores for ranking:', error?.message);
        }
        
        // Use whatever data we got, even if empty
        const totalPlayers = data?.length || 1;
        let rank = 1;

        if (data && data.length > 0) {
          for (const entry of data) {
            if (
              entry.score > userScore.score || 
              (entry.score === userScore.score && entry.time < userScore.time)
            ) {
              rank++;
            }
          }
        }

        return {
          rank,
          total_players: totalPlayers
        };
      }),
      catchError(err => {
        console.error('All retries failed getting ranking:', err);
        // Return minimal valid data
        return of({
          rank: 1,
          total_players: 1
        });
      })
    );
  }
}
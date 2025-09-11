import { Injectable } from '@angular/core';
import { Question, Rank, Score } from '../models/core.model';
import { SupabaseService } from './supabase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    private supabaseService: SupabaseService
  ) {
  }

  public getQuestionById(id: number): Observable<Omit<Question, 'answer'> | null> {
    return this.supabaseService.getQuestion(id);
  }

  public getAnswerById(id: number): Observable<Omit<Question, 'question'> | null> {
    return this.supabaseService.getAnswer(id);
  }

}

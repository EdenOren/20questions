import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { AppRoutes } from './enums/core.enums';
import { Question } from '../features/question/question';
import { Review } from '../features/review/review';

export const routes: Routes = [
  {
    path: AppRoutes.Home,
    component: Home
  },
  {
    path: AppRoutes.Questions,
    component: Question
  },
    {
    path: AppRoutes.Review,
    component: Review
  }
];

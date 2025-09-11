import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '../../shared/layout/header/header';
import { Router } from '@angular/router';
import { AppRoutes } from '../../core/enums/core.enums';
import { Button } from '../../shared/ui/button/button';
import { InnerLayout } from "../../shared/inner-layout/inner-layout";

@Component({
  selector: 'app-home',
  imports: [Header, Button, InnerLayout],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  constructor(private router: Router) {}

  public startGame() {
    this.router.navigate([`/${AppRoutes.Questions}`]);
  }
}

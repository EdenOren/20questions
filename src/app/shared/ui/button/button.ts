import { NgClass } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

export enum ButtonColor {
  Blue = 'blue',
  Green = 'green',
  Red = 'red',
  Yellow = 'yellow',
  Purple = 'purple'
}
@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {
  title: InputSignal<string> = input<string>('');
  icon: InputSignal<string> = input<string>('');
  color: InputSignal<string> = input<string>(ButtonColor.Purple);
}

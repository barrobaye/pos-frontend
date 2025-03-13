import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    NgOptimizedImage
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  constructor(private route:Router) {
  }

  selectedValue1: string = '';


  activateLabel(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue1 = value;

    if(value == "1"){
      this.route.navigate(['/produits']);
    }
    if(value == "2"){
      this.route.navigate(['/caissiers']);
    }
    if(value == "3"){
      this.route.navigate(['/orders']);
    }
    if(value == "4"){
      this.route.navigate(['/rapport']);
    }
    if(value == "0"){
      this.route.navigate(['/dash']);
    }
    console.log('Label activated:', value);
  }

  logOut(){

  }
}

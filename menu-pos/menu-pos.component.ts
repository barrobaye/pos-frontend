import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu-pos',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './menu-pos.component.html',
  styleUrl: './menu-pos.component.scss'
})
export class MenuPosComponent {


  constructor(private route:Router) {
  }

  selectedValue1: string = '';
  activateLabel(value: string) {
    // Implement your logic here to activate the corresponding label
    // For example, you might update a variable to track the selected payment method
    this.selectedValue1 = value;

    if(value == "0"){
      this.route.navigate(['/pos']);
    }
    if(value == "1"){
      this.route.navigate(['/order']);
    }
    if(value == "2"){
      this.route.navigate(['/stats']);
    }
    console.log('Label activated:', value);
  }




}

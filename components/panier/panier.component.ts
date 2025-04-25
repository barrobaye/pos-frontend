import { Component } from '@angular/core';
import { ApiUrlService } from '../../../core/api-url.service';
import { ProductService } from '../../../services/product/product.service';
import { FormBuilder } from '@angular/forms';
import { CartService } from '../../../services/cart/cart.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [
      NgIf,
        NgForOf,
        NgClass

  ],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.scss'
})
export class PanierComponent {
     constructor(  
        public apiUrlService: ApiUrlService,
        private produitService:ProductService,
         private formBuilder: FormBuilder,
        private cartService:CartService){
       
        }

}

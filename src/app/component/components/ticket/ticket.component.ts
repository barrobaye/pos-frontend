import { Component } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { CartService } from '../../../services/cart/cart.service';
import { ProductService } from '../../../services/product/product.service';
import { ApiUrlService } from '../../../core/api-url.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    QRCodeModule 
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.scss'
  
})

export class TicketComponent {
 
   checkoutFormGroup:FormGroup;
   constructor(  
      public apiUrlService: ApiUrlService,
      private produitService:ProductService,
       private formBuilder: FormBuilder,
      private cartService:CartService){
        this.checkoutFormGroup= this.formBuilder.group({
        
        })
      }
  terminer() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();


    //navigate back to the products page
    window.location.reload();
  }

}

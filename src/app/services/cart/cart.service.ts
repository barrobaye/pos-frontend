import { Injectable } from '@angular/core';

import {BehaviorSubject, Subject} from "rxjs";
import {CartItem} from '../../common/cart-item';
import {Surplus} from '../../common/surplus';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  surplus:Surplus[]=[];

  //subject is a subclass of observable which we can use to publish events. the event will be sent to all subscribers of this service
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //storage: Storage = sessionStorage; //saves in-memory (lost after browser is closed)
  // storage: Storage = localStorage; //saves in-session (not lost after browser is closed)


  constructor() {

    //read data from storage
    if (typeof window !== 'undefined' && window.localStorage){
      const data = JSON.parse(window.localStorage.getItem('cartItems')!);
      if(data != null){
        this.cartItems = data;
        // this.surplus = data.surplus;

        //compute totals based on the data that is read from storage
        this.computeCartTotals()
      }
    }

    // let sup = JSON.parse(this.storage.getItem('surplus')!);


  }

  addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean=false;
    let existingCartItem: CartItem= undefined!;
    // theCartItem.surplus = surplus;

    if(this.cartItems.length > 0){
      //find the item in the cart based on item id
      for(let tempCartItem of this.cartItems){
        if(tempCartItem.id === theCartItem.id){
          existingCartItem = tempCartItem;
          alreadyExistsInCart = true;
          break;
        }
      }


    }




    //check if we found it
    if(alreadyExistsInCart){
      console.log("got here")
      // existingCartItem.quantity++;
      console.log("after: " + existingCartItem.quantity + ` ${existingCartItem.name}`);
      console.log(existingCartItem.surplus);
      // existingCartItem.surplus = surplus;
    }else{
      // theCartItem.surplus = surplus; // Add surplus to new item
      this.cartItems.push(theCartItem);
      console.log(`Added "${theCartItem.name}" to cart with quantity ${theCartItem.quantity}`);
    }

    // this.calculateSubtotal(theCartItem);
    //compute cart totalPrice and totalQuantity
    this.computeCartTotals();


  }







  // addToCart(theCartItem: CartItem,surplus: Surplus[]){
  //
  //   //check if we already have the item in our cart
  //   let alreadyExistsInCart: boolean=false;
  //   let existingCartItem: CartItem= undefined!;
  //   theCartItem.surplus = surplus;
  //
  //   if(this.cartItems.length > 0){
  //     //find the item in the cart based on item id
  //     for(let tempCartItem of this.cartItems){
  //       if(tempCartItem.id === theCartItem.id){
  //         existingCartItem = tempCartItem;
  //         alreadyExistsInCart = true;
  //         break;
  //       }
  //     }
  //
  //
  //
  //   }
  //
  //
  //
  //
  //   //check if we found it
  //   if(alreadyExistsInCart){
  //     console.log("got here")
  //     existingCartItem.quantity++;
  //     console.log("after: " + existingCartItem.quantity + ` ${existingCartItem.name}`);
  //     console.log(existingCartItem.surplus);
  //     existingCartItem.surplus = surplus;
  //   }else{
  //     theCartItem.surplus = surplus; // Add surplus to new item
  //     this.cartItems.push(theCartItem);
  //     console.log(`Added "${theCartItem.name}" to cart with quantity ${theCartItem.quantity}`);
  //   }
  //
  //   this.calculateSubtotal(theCartItem);
  //   //compute cart totalPrice and totalQuantity
  //   this.computeCartTotals();
  //
  //
  // }

  public computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      // Calculate total surplus price for this item
      // const totalSurplusPrice = currentCartItem.surplus ? currentCartItem.surplus.reduce((acc, surplus) => acc + surplus.priceS, 0) : 0;
      //
      // // Calculate subtotal considering unit price and total surplus price
      // const itemSubtotal = currentCartItem.quantity * (currentCartItem.unitPrice + totalSurplusPrice);

      // const totalSurplusPrice = currentCartItem.surplus ? currentCartItem.surplus.reduce((acc, surplus) => acc + surplus.priceS, 0) : 0;

      // Calculate subtotal considering unit price and total surplus price
      // const itemSubtotal = currentCartItem.quantity * currentCartItem.unitPrice ;

      totalPriceValue += currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;

    }

    // Update totals with the new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);

    // Persist cart data (assuming persistCartItems exists)
    this.persistCartItems();
  }

  persistCartItems(){
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    }
  }

  private logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contenu du panier");
    for (let tempCartItem of this.cartItems) {
      if (tempCartItem.surplus) {
        let totalSurplus = 0; // Initialisation du total des surplus


        // for (let surplus of tempCartItem.surplus) {
        //   totalSurplus += surplus.priceS; // Ajout du prix du surplus au total
        // }

        // Calcul du sous-total en incluant le total des surplus

        // tempCartItem.subTotalPrice =tempCartItem.quantity * (tempCartItem.unitPrice + totalSurplus);
        let tot =+tempCartItem.unitPrice;



        // console.log(`Nom: ${tempCartItem.name}, Quantité=${tempCartItem.quantity}, Prix unitaire=${tempCartItem.unitPrice}, Sous-total=${ tempCartItem.subTotalPrice}`);

        // Affichage des surplus avec un formatage plus clair
        // if (tempCartItem.surplus && tempCartItem.surplus.length > 0) {
        //   console.log(`Surplus:`);
        //   tempCartItem.surplus.forEach(surplus => {
        //     console.log(` ${surplus.name} - Prix: ${surplus.priceS}`);
        //   });
        // }
      }
      tempCartItem.subTotalPrice =tempCartItem.quantity * totalPriceValue;
    }
    console.log(`Prix total: ${totalPriceValue.toFixed(2)}, Quantité totale: ${totalQuantityValue}`);
    console.log("------");
  }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;

    if(tempCartItem.quantity == 0){
      this.remove(tempCartItem);
    }else{
      // Recalculate subtotal and cart totals considering surplus prices
      // this.calculateSubtotal(tempCartItem);
      this.computeCartTotals()
    }
  }

  // private calculateSubtotal(cartItem: CartItem | undefined) {
  //   if (cartItem && cartItem.surplus && cartItem.surplus.length > 0) {
  //     const totalSurplusPrice = cartItem.surplus.reduce((acc, surplus) => acc + surplus.priceS, 0);
  //     cartItem.subTotalPrice = cartItem.quantity * (cartItem.unitPrice + totalSurplusPrice);
  //   }
  // }


  public remove(theCartItem: CartItem) {

    //get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

    if(itemIndex>-1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals()
    }

    //if found, remove the item

  }
  public removeAllCartItems() {
    this.cartItems.splice(0, this.cartItems.length);
    this.computeCartTotals();
  }

}

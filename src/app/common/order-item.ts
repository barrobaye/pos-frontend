import {CartItem} from "./cart-item";

export class OrderItem {

  public imageUrl: string
  public price: number
  public quantity: number
  public productsId: string
  public name!:string;

  constructor(
              cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.quantity = cartItem.quantity;
    this.price = cartItem.unitPrice;
    this.productsId = cartItem.id;
    this.name = cartItem.name;

  }
}

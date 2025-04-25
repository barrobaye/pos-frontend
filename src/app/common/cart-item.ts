import {Product} from "./product";
import {Surplus} from './surplus';

export class CartItem {

  id: string;
  name:string;
  imageUrl:string;
  unitPrice: number;
  quantity: number;
  subTotalPrice!:number;
  surplus: Surplus[] | undefined;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;
    this.quantity = 1;

  }
}

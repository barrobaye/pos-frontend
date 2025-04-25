
import {Customer} from "./customer";
import {Caissier} from "./caissier";
import {Order} from "./order";
import {OrderItem} from "./order-item";
import {OrderSurplus} from './orderSurplus';

export class Purchase {
    public customer: Customer | undefined;
   public caissier:Caissier | undefined;
    public order: Order | undefined;
    public orderItems: OrderItem[] | undefined;
    public orderSurpluses:OrderSurplus[] | undefined;

  constructor() {
  }
}

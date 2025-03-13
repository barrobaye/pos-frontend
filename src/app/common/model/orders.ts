import {Statuts} from '../statuts.enum';
import {Customer} from '../customer';
import {Caissier} from '../caissier';

export interface Orders {
  id:string | undefined;
  totalQuantity: number | undefined
  totalPrice: number | undefined
  moyen: number | undefined;
  delivery: number | undefined;
  orderTrackingNumber:string | undefined;
  statuts:Statuts |undefined;
  dateCreated:Date | undefined;
  customer:Customer | undefined;
  caissier:Caissier | undefined;
  tempsLivraison:number | undefined;
  tempsCuisine:number | undefined;
}

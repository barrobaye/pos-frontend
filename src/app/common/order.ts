import {Customer} from './customer';
import {Caissier} from './caissier';
import {Statuts} from './statuts.enum';

export class Order{

  public id:number | undefined;
  public totalQuantity: number | undefined
  public totalPrice: number | undefined
  public moyen: number | undefined;
  public delivery: number | undefined;
  public orderTrackingNumber:string | undefined;
  public statuts:Statuts |undefined;
  public dateCreated:Date | undefined;
  public customer:Customer | undefined;
  public caissier:Caissier | undefined;
  public tempsLivraison:number | undefined;
  public  tempsCuisine:number | undefined;
  public typeOrder:TypeOrder | undefined;
  public serviceType:String | undefined;
  public tableD:String | undefined;

  constructor() {

  }



}

enum TypeOrder{
  Surplace,Emporter
}





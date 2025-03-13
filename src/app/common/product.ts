import {ProductCategory} from './product-category';
import {Admin} from './admin';
import {OrderItem} from './order-item';
import {Surplus} from './surplus';

export class Product {
  public id!: string;
  public sku!: string;
  public name!: string;
  public description!: string;
  public unitPrice!: number;
  public imageUrl!: any;
  public active!: boolean;
  public unitsInStock!: number;
  public dateCreated!: Date;
  public lastUpdated!: Date;
  public category!:ProductCategory;
  public admin!:Admin;
  // public surplus: Surplus[] | undefined;
  //names match with the data that is passed by the spring boot
  // constructor(product : Product){
  //   this.id = product.id;
  //   this.sku = product.sku;
  //   this.name = product.name;
  //   this.description = product.description;
  //   this.unitPrice = product.unitPrice;
  //   this.imageUrl = product.imageUrl;
  //   this.active = product.active;
  //   this.unitsInStock = product.unitsInStock;
  //   this.dateCreated = product.dateCreated;
  //   this.lastUpdated = product.lastUpdated;
  //   this.category = product.category;
  //
  //
  // }
  constructor() {
  }
}

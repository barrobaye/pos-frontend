import { Component } from '@angular/core';
import {ProductService} from '../../services/product/product.service';
import {ProductCategory} from '../../common/product-category';

@Component({
  selector: 'app-categorie-menu',
  standalone: true,
  imports: [],
  templateUrl: './categorie-menu.component.html',
  styleUrl: './categorie-menu.component.scss'
})
export class CategorieMenuComponent {

  productCategories: ProductCategory[] = [];
  constructor(private productService: ProductService){}

  // private listProductCategories() {
  //   this.productService.getProductCategories().subscribe(
  //     data => {
  //       console.log('Product categoriessss = ' + JSON.stringify(data))
  //       this.productCategories = data;
  //     }
  //   )
  // }
}

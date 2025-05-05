import {Component, NgZone, OnInit} from '@angular/core';
import {MenuPosComponent} from '../menu-pos/menu-pos.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {Order} from '../../common/order';
import {Orders} from '../../common/model/orders';
import {OrderService} from '../../services/order/order.service';
import {CaisseService} from '../../services/auth/caisse/caisse.service';
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {Subscription, switchMap, timer} from 'rxjs';
import {ProductService} from '../../services/product/product.service';
import {Statuts} from '../../common/statuts.enum';

@Component({
  selector: 'app-list-order',
  standalone: true,
    imports: [
        MenuPosComponent,
        FormsModule,
        NgForOf,
        NgIf,
        NgOptimizedImage,
        DatePipe,
        MatButton,
        ReactiveFormsModule,
        RouterLink,
        SlicePipe
    ],
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.scss'
})
export class ListOrderComponent implements OnInit {

  orders !:Orders[];
  ordersItem!:any[];


  constructor(private orderService: OrderService,private caissierService:CaisseService,
              private produitService:ProductService,private ngZone: NgZone) {

  }

  public subscription = new Subscription();
  ordersEnCours:any;
  enCours = false;
  log1:any;
  nbreCom!:number;
  ngOnInit() {
    this.log1 = this.caissierService.getLoginV();
    // this.orderService.listOrder(this.caissierService.getLoginV()).subscribe(
    //   data =>{
    //     this.orders = data;
    //     console.log(data);
    //   }
    // )
    this.orderService.listOrders().subscribe({
      next:orders =>{
        this.orders = orders;
       // console.log(this.orders);
        this.applyFilter();
      },
      error:err=>{
        alert("Commande introuvable...:)");
      }
    })

   this.ngZone.runOutsideAngular(()=>{
     this.subscription.add(timer(0,1000).pipe(
       switchMap(()=> this.orderService.listOEnCours()),

     ).subscribe(
       (orders)=>{
         this.ordersEnCours = orders;
         this.nbreCom = this.ordersEnCours.length;
         // console.log(this.ordersEnCours.length);
       }
     ))
   })




  }

  orderFilter:Orders [] = [];
  totalOrders!:any
  today = new Date().toISOString().slice(0, 10) ;
 applyFilter(){
const tod = new Date(this.today);
   this.orderFilter = this.orders.filter(
     order =>{
       const dateCreated = order.dateCreated;
       return dateCreated === tod;
     }
   );
   if(this.orderFilter.length === 0){
     this.orderFilter = [] ;
   }

   this.totalOrders = this.orderFilter.filter(order => order.statuts === Statuts.Termines).length;

 }
  showEnCours(){
    this.enCours = true;
  }
  closeEnCours(){
    this.enCours = false;
  }


  productId!:any;
  surplusI!:any;
  seeOrderItems(id: any) {
    this.orderService.listOrderItem(id).subscribe(
      data => {
        this.ordersItem = data;
        // this.productId = data.productsId;


        if (this.ordersItem && this.ordersItem.length > 0) {
          // Parcourez chaque élément de ordersItem
          this.ordersItem.forEach((item, index) => {
            // Utilisez l'ID de l'élément actuel
            this.orderService.listSurplusD(item.id).subscribe(
              dataO => {
                this.surplusI = dataO;

                console.log(`Surplus pour l'élément ${index}:`, this.surplusI);
              },
              error => {
                console.error(`Erreur lors de la récupération des surplus pour l'élément ${index}:`, error);
              }
            );
          });
        } else {
          console.warn('Aucun élément de commande trouvé.');
        }

        console.log('Items de commande récupérés:', this.ordersItem);
      },
      error => {
        console.error('Erreur lors de la récupération des éléments de commande:', error);
      }
    );
  }

  updateOrders(id:any){

    let formData = new FormData();
    formData.append('orderId', id);
    formData.append('loginCaissier',this.caissierService.getLoginV());

    this.orderService.updateOrderCaissier(formData).subscribe(
      {
        next:response=>{
          alert(`Commande lancer avec succes ...`);
          this.closeEnCours();
        },
        error:err=>{
          alert(`There was an error: ${err.message}`)
        }
      }
    )

  }

}

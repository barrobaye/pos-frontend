import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from '../../services/order/order.service';
import {Order} from '../../common/order';
import {DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {catchError, interval, map, Subject, Subscription, switchMap, takeUntil, timer} from 'rxjs';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-cuisine',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgIf,
    DatePipe,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './cuisine.component.html',
  styleUrl: './cuisine.component.scss'
})
export class CuisineComponent implements OnInit,OnDestroy{

  orders : any;
  ordersPrep!:any;
  // private destroy$ = new Subject<void>();
  // cuisineForm:FormGroup;

  constructor(private orderService: OrderService,private ngZone: NgZone)  {
      // this.cuisineForm = formBuilder.group({
      //   orderId : []
      // })


  }

  // private subscription!: Subscription;


  ngOnInit() {

  // this.subscription.add(
  //       interval(10000).pipe(
  //         switchMap(() => this.orderService.listOrderCuisine().pipe(
  //           catchError(error => {
  //             console.error('Erreur lors de la récupération des commandes', error);
  //             return []; // Retourne un tableau vide en cas d'erreur
  //           })
  //         )),
  //         map((orders) => orders)
  //       ).subscribe((agents) => {
  //         this.orders = agents;
  //       })
  //     );
  //
  //   this.subscription.add(timer(0,1000).pipe(
  //     switchMap(()=>
  //       this.orderService.listOrderCuisine()
  //     ),
  //   ).subscribe(
  //     (data)=>{
  //       this.orders = data;
  //       console.log(data);
  //     }
  //   ));

    this.orderService.listOrderCuisine().subscribe(
      data =>{
        this.orders = data;
        this.loadOrderItemsForOrders(this.orders);
        console.log(data)
      }
    );

    // this.subscription = interval(12000)
    //   .pipe(switchMap(()=>this.orderService.listOrderCuisine())).subscribe(
    //     res =>
    //     {
    //       this.orders = res;
    //     }
    //   )

    this.orderService.listOEnPreparation().subscribe(
      data =>{
        this.ordersPrep = data;

        console.log(data)
      }
    )

    // this.startOrderPolling();
  }
  // private startOrderPolling() {
  //   this.subscription.add(
  //     interval(10000).pipe(
  //       switchMap(() => this.orderService.listOrderCuisine().pipe(
  //         catchError(error => {
  //           console.error('Erreur lors de la récupération des commandes', error);
  //           return []; // Retourne un tableau vide en cas d'erreur
  //         })
  //       )),
  //       map((orders) => orders)
  //     ).subscribe((agents) => {
  //       this.orders = agents;
  //     })
  //   );
  // }

  submit(id:any){

    this.orderService.updateDebCuis(id).subscribe(
      {
        next:response=>{
          // alert(`Commande en cuisson....`)
          window.location.reload();
        },
        error:err => {
          alert(`Quelque chose n'a pas fonctionee`)
        }
      }
    )

  }

  // viewItems(id: any) {
  //   // this.orderService.listOrderItem(id).subscribe(res => {
  //   //   const items = res.plats; // Récupérer les plats
  //   //   const order = this.orders.find(order => order.id === id); // Trouver la commande correspondante
  //   //   if (order) {
  //   //     order.items = items; // Associer les items à la commande
  //   //   }
  //   // });
  //   this.orderService.listOrderItem(id).subscribe(res=>{
  //     this.ordersItem = res;
  //     console.log(this.ordersItem);
  //   })
  // }

  loadOrderItemsForOrders(orders: any[]) {
    orders.forEach(order => {
      this.orderService.listOrderItem(order.id).subscribe(res => {
        order.items = res; // Associer les items à chaque commande
      });
    });
  }

  getOrderStatusBadgeClass(serviceType: string): string {
    switch (serviceType) {
      case 'surPlace':
        return 'badge bg-danger';
      case 'aEmporter':
        return 'badge bg-primary';
      case 'livraison':
        return 'badge bg-warning'; // Vous pouvez personnaliser les couleurs
      default:
        return 'badge bg-secondary'; // Classe par défaut si le type de service est inconnu
    }
  }
  submit2(id:any){

    this.orderService.updateFinCuis(id).subscribe(
      {
        next:response=>{
          alert(`Commande terminer ....`)
          window.location.reload();
        },
        error:err => {
          alert(`Quelque chose n'a pas fonctionee`)
        }
      }
    )

  }
  enCours = false;
  ordersEnCours:any;
  showEnCours(){
    this.enCours = true;
  }
  closeEnCours(){
    this.enCours = false;
  }
  productId!:any;
  ordersItem!:any;
  surplusI!:any;
  seeOrderItems(id: number) {
    this.orderService.listOrderItem(id).subscribe(
      data => {

        this.ordersItem = data;
        this.productId = data.productsId;
        if (this.ordersItem && this.ordersItem.length > 0) {
          // Parcourez chaque élément de ordersItem
          this.ordersItem.forEach((item:any, index:number) => {
            // Utilisez l'ID de l'élément actuel
            this.orderService.listSurplusD(item.id).subscribe(
              dataO => {
                this.surplusI = dataO;
                this.showEnCours();
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


        // window.location.reload();
        console.log('Items de commande récupérés:', this.ordersItem);
      },
      error => {
        console.error('Erreur lors de la récupération des éléments de commande:', error);
      }
    );
  }


  ngOnDestroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
    // this.subscription.unsubscribe();
    // Désabonnement pour éviter les fuites de mémoire
  }




}

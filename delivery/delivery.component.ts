import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderService} from '../../services/order/order.service';
import {debounce, interval, map, startWith, Subscription, switchMap, timer} from 'rxjs';
import {Order} from '../../common/order';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {response} from 'express';

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './delivery.component.html',
  styleUrl: './delivery.component.scss'
})
export class DeliveryComponent implements OnInit,OnDestroy{

  constructor(private orderService: OrderService) {
  }

  public subscription = new Subscription();
  ordersDelivery! : any;
  ordersDeliv!:any;
  ngOnInit() {
    // this.subscription.add(timer(0,1000).pipe(
    //   switchMap(()=> this.orderService.listODelivery()),
    //
    // ).subscribe(
    //   (orders)=>{
    //     this.ordersDelivery = orders;
    //     console.log(this.ordersDelivery);
    //   }
    // ))


    this.orderService.listODelivery().subscribe(
      (data)=>{
        this.ordersDelivery = data;
      }
    )

    this.orderService.listOEnLivraions().subscribe(
      (data)=>{
        this.ordersDeliv = data;
      }
    )




  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  submit(id:any){

    this.orderService.updateDebuLivr(id).subscribe(
      {
        next:response=>{
          alert(`Commande Livree....`)
          window.location.reload();
        },
        error:err => {
          alert(`Quelque chose n'a pas fonctionee`)
        }
      }
    )

  }

  submit2(id:any){

    this.orderService.updateFinLivraison(id).subscribe(
      {
        next:response=>{
          alert(`Commande Livree....`)
          window.location.reload();
        },
        error:err => {
          alert(`Quelque chose n'a pas fonctionee`)
        }
      }
    )

  }

}

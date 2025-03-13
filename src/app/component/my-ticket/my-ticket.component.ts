import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../services/order/order.service';
import {catchError, EMPTY, map, Subscription, switchMap, timer} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {QRCodeComponent} from 'angularx-qrcode';

@Component({
  selector: 'app-my-ticket',
  standalone: true,
  imports: [
    QRCodeComponent
  ],
  templateUrl: './my-ticket.component.html',
  styleUrl: './my-ticket.component.scss'
})
export class MyTicketComponent implements OnInit{

  constructor(private orderService: OrderService,private route:ActivatedRoute) {
  }

  private subscription$ : Subscription = new Subscription();
  order:any;
 async ngOnInit() {

    const orderTr = this.route.snapshot.params['num'];
    // this.subscription$.add(timer(1,100).pipe(
    //   switchMap(()=> this.orderService.getMyTicket(orderTr).pipe(
    //     catchError(error => {
    //       if (error.status === 429) {
    //         console.error('429 Too Many Requests error:', error);
    //         window.location.reload(); // Reload page on 429 error
    //       }
    //       if (error.status === 500) {
    //         console.error('500 Too Many Requests error:', error);
    //         window.location.reload(); // Reload page on 429 error
    //       }else {
    //         console.error('Error fetching tickets:', error);
    //         // Handle other errors (e.g., display error message)
    //       }
    //       return EMPTY;
    //     })
    //   )),
    //   map(
    //     (orders)=>orders
    //   )
    // ).subscribe((order)=>{
    //   if(order.statuts ==0){
    //
    //   }
    //   this.order = order;
    //   console.log(this.order);
    //   })
    // )

    this.orderService.getMyTicket(orderTr).subscribe(
      res=>{
        this.order = res;
        console.log(this.order)
      }
    )
  }


}

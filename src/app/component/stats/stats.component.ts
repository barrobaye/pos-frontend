import {Component, OnInit} from '@angular/core';
import {MenuPosComponent} from '../menu-pos/menu-pos.component';
import {OrderService} from '../../services/order/order.service';
import {CaisseService} from '../../services/auth/caisse/caisse.service';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage, SlicePipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    MenuPosComponent,
    FormsModule,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    RouterLink,
    SlicePipe,
    DatePipe
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit{


  login = "";
  orders!:any;
  totalOrder:number =0;
  totalPrice:number =0;
  constructor(private orderService:OrderService,private caissierService:CaisseService) {
  }

  ngOnInit() {
    this.login = this.caissierService.getLoginV();
    // console.log(this.login);

    this.orderService.listOrder(this.login).subscribe({
      next: orders =>{
        this.orders = orders;

        // this.totalPrice = this.orders.reduce((accumulator, orders) => {
        //   return accumulator + orders.totalPrice; // Assurez-vous que totalPrice existe dans chaque order
        // }, 0);

        console.log(this.orders);

        this.totalOrder = this.orders.length;

      },
      error:err=>{
        alert("Quelque chose ne marche pas ressayer")
      }
    });


  }

  // dateCreated:string = new Date().toISOString().slice(0, 10) ;
  // ordersFilter!:any[];
  // selectStatus="";
  // selectMoyen = "";
  //
  // applyFilter(){
  //
  //   const dateN = new Date(this.dateCreated);
  //   this.ordersFilter = this.orders.filter(order=>{
  //     const dateCreated = new Date(order.dateCreated);
  //     const statuts = order.statuts;
  //     const moyen = order.moyens;
  //     return dateCreated == dateN && ( this.selectStatus === "" || statuts === this.selectStatus ) && (this.selectMoyen === "" || moyen === this.selectMoyen);
  //   });
  //
  //
  //
  // }

}

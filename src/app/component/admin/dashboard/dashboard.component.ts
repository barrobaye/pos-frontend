import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {OrderService} from '../../../services/order/order.service';
import {AdminService} from '../../../services/auth/admin/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MenuComponent,
    DatePipe,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  // @ViewChild('line') canvasRef2!: ElementRef;

  orders!:any;
  loginAdmin!:any;
  imgSite!:string;

  admin!:any;
  constructor(private orderService:OrderService,private adminService:AdminService) {
  }
  ngOnInit() {

    this.loginAdmin = this.adminService.getLoginA();

    this.adminService.getAdminByLog(this.loginAdmin).subscribe(
      res=>{
        this.admin = res;
        this.imgSite = res.imgSite;
        console.log(this.admin);
      }
    )

    this.orderService.listOrders().subscribe(
      res=>{
        this.orders = res;
      }
    )
  }



}

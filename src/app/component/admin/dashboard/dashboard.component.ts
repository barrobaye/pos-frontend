import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MenuComponent} from '../menu/menu.component';
<<<<<<< HEAD
import {DatePipe, NgForOf, NgIf} from '@angular/common';
=======
import {DatePipe, isPlatformBrowser, NgForOf, NgIf} from '@angular/common';
>>>>>>> mon-travail-local
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {OrderService} from '../../../services/order/order.service';
import {AdminService} from '../../../services/auth/admin/admin.service';
<<<<<<< HEAD
=======
import { ProductService } from '../../../services/product/product.service';
import { NgChartsModule } from 'ng2-charts';
import { Product } from '../../../common/product';
import { ChartOptions, ChartType } from 'chart.js';
import { Inject, PLATFORM_ID } from '@angular/core';
>>>>>>> mon-travail-local

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
<<<<<<< HEAD
    RouterLink
=======
    RouterLink,
    NgChartsModule
>>>>>>> mon-travail-local
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  // @ViewChild('line') canvasRef2!: ElementRef;

  orders!:any;
  loginAdmin!:any;
  imgSite!:string;
<<<<<<< HEAD

  admin!:any;
  constructor(private orderService:OrderService,private adminService:AdminService) {
=======
  products: Product[] = [];

  // Data for Doughnut Chart
  doughnutLabels: string[] = [];
  doughnutData: number[] = [];
  doughnutType: ChartType = 'doughnut';

  // Data for Bar Chart
  barLabels: string[] = [];
  barData: number[] = [];
  barType: ChartType = 'bar';

  admin!:any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private orderService:OrderService,
    private produitService:ProductService,
    private adminService:AdminService) {
>>>>>>> mon-travail-local
  }
  ngOnInit() {

    this.loginAdmin = this.adminService.getLoginA();

    this.adminService.getAdminByLog(this.loginAdmin).subscribe(
      res=>{
        this.admin = res;
        this.imgSite = res.imgSite;
<<<<<<< HEAD
        console.log(this.admin);
=======
       // console.log(this.admin);
>>>>>>> mon-travail-local
      }
    )
      
    this.orderService.listOrders().subscribe(
      res=>{
        this.orders = res;
      }
    )
<<<<<<< HEAD
  }



}
=======
  /*   this.produitService.getProducts().subscribe(
      res=>{
         console.log(res.length);
      }
    ) */
      if (isPlatformBrowser(this.platformId)) {
        this.loadCharts(); // <--- uniquement côté client
      }     
    
  }

  loadCharts(): void {
    this.produitService.getProducts().subscribe((products) => {
      this.products = products;
  
      // DONUT
      const categoryCount: Record<string, number> = {};
      for (const p of this.products) {
       const cat = p.category?.categoryName ?? 'Inconnu';
       categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      }
      this.doughnutLabels = Object.keys(categoryCount);
      this.doughnutData = Object.values(categoryCount);
  
      // BAR
      this.barLabels = this.products.map(p => p.name);
      this.barData = this.products.map(p => p.unitsInStock);
    });
  }

}

>>>>>>> mon-travail-local

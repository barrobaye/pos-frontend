import { Routes } from '@angular/router';
import {PosComponent} from './component/pos/pos.component';
import {HomeCliComponent} from './component/home-cli/home-cli.component';
import {MenuPosComponent} from './component/menu-pos/menu-pos.component';
import {ListOrderComponent} from './component/list-order/list-order.component';
import {StatsComponent} from './component/stats/stats.component';
import {CuisineComponent} from './component/cuisine/cuisine.component';
import {DashboardComponent} from './component/admin/dashboard/dashboard.component';
import {ProduitsComponent} from './component/admin/produits/produits.component';
import {CaissiersComponent} from './component/admin/caissiers/caissiers.component';
import {ConnexionComponent} from './component/admin/connexion/connexion.component';
import {ConnexionCaisComponent} from './component/connexion-cais/connexion-cais.component';
import {DeliveryComponent} from './component/delivery/delivery.component';
import {DeliveryListComponent} from './component/admin/delivery-list/delivery-list.component';
import {Home2Component} from './component/home-2/home-2.component';
import {Home3Component} from './component/home3/home3.component';
import {FirstComponent} from './component/first/first.component';
import {Home4Component} from './component/home4/home4.component';
import {MyTicketComponent} from './component/my-ticket/my-ticket.component';
import {Pos2Component} from './component/pos2/pos2.component';

export const routes: Routes = [
  {path:'',redirectTo:'first',pathMatch:'full'},
  {path:'first',component:FirstComponent},
  {path:'connexion', component:ConnexionComponent},
  {path:'caissier/connexion',component:ConnexionCaisComponent},
  {path:'pos',component:PosComponent},
  {path:'pos/:login',component:PosComponent},
  {path:'pos2',component:Pos2Component},
  {path:'pos2/:login',component:Pos2Component},
  {path:'home',component:HomeCliComponent},
  {path:'home2',component:Home2Component},
  {path:'order',component:ListOrderComponent},
  {path:'stats',component:StatsComponent},
  {path:'cuisine',component:CuisineComponent},
  {path:'dash',component:DashboardComponent},
  {path:'produits',component:ProduitsComponent},
  {path:'caissiers',component:CaissiersComponent},
  {path:'delivery',component:DeliveryComponent},
  {path:'deliveryList',component:DeliveryListComponent},
  {path: 'menu',component:MenuPosComponent},
  {path:'home3',component:Home3Component},
  {path:'home4',component:Home4Component},
  {path:'myTicket/:num',component:MyTicketComponent}

  // {path: 'search/:keyword', component: HomeClientComponent}
];

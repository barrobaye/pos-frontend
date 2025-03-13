import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Order} from '../../common/order';
import {OrderItem} from '../../common/order-item';
import {Orders} from '../../common/model/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orderUrl = 'https://posback.jcloud-ver-jpe.ik-server.com/lOrder';
  private orderItemUrl = 'https://posback.jcloud-ver-jpe.ik-server.com/orderItem';
  private orders = 'https://posback.jcloud-ver-jpe.ik-server.com/allOrder';
  private cuisineOrder = 'https://posback.jcloud-ver-jpe.ik-server.com/orderPayes';
  private updateUrl = 'https://posback.jcloud-ver-jpe.ik-server.com/orders';
  private orderEn = 'https://posback.jcloud-ver-jpe.ik-server.com/orderEnCours';
  private ordersCaissierUrl = 'https://posback.jcloud-ver-jpe.ik-server.com/ordersCaissier';
  private orderDelivery = 'https://posback.jcloud-ver-jpe.ik-server.com/orderDelivery';


  private EnPrep = 'https://posback.jcloud-ver-jpe.ik-server.com/ordersEnPrep';
  private FinPrep = 'https://posback.jcloud-ver-jpe.ik-server.com/ordersFinPrep';
  private EncoursPrep = 'https://posback.jcloud-ver-jpe.ik-server.com/orderEnCuisson'
  private EncoursLivraison = 'https://posback.jcloud-ver-jpe.ik-server.com/orderEnLivraison';

  private EnLivraison  = 'https://posback.jcloud-ver-jpe.ik-server.com/ordersEnLivr';
  private FinLivraison = 'https://posback.jcloud-ver-jpe.ik-server.com/ordersFinLivr';

  private orderDetails = "https://posback.jcloud-ver-jpe.ik-server.com/ordersurplusI";

  private orderTr = "https://posback.jcloud-ver-jpe.ik-server.com/ordersTr";

  // private orderUrl = "http://localhost:8080/lOrder";
  // private orderItemUrl = "http://localhost:8080/orderItem";
  // private orders = "http://localhost:8080/allOrder";
  // private cuisineOrder = "http://localhost:8080/orderPayes";
  // private updateUrl = "http://localhost:8080/orders";
  // private orderEn = "http://localhost:8080/orderEnCours";
  // private ordersCaissierUrl = "http://localhost:8080/ordersCaissier";
  // private orderDelivery = "http://localhost:8080/orderDelivery";
  //
  // private EnPrep = "http://localhost:8080/ordersEnPrep";
  // private FinPrep = "http://localhost:8080/ordersFinPrep";
  // private EncoursPrep = "http://localhost:8080/orderEnCuisson";
  // private EncoursLivraison = "http://localhost:8080/orderEnLivraison";
  //
  // private EnLivraison  = "http://localhost:8080/ordersEnLivr";
  // private FinLivraison = "http://localhost:8080/ordersFinLivr";
  //
  // private orderDetails = "http://localhost:8080/ordersurplusI";
  //
  // private orderTr = "http://localhost:8080/ordersTr";

  constructor(private http: HttpClient) {}


  listOEnCours():Observable<any>{
    return this.http.get(this.orderEn).pipe(
      map(
        data => data
      )
    )
  }
  listOEnPreparation():Observable<any>{
    return this.http.get(this.EncoursPrep).pipe(
      map(
        data => data
      )
    )
  }

  listOEnLivraions():Observable<any>{
    return this.http.get(this.EncoursLivraison).pipe(
      map(
        data => data
      )
    )
  }






   listODelivery():Observable<any>{
    return this.http.get(this.orderDelivery).pipe(
      map(
        data => data
      )
    );
  }


  updateOrderCaissier(order:any):Observable<any>{
    return this.http.put(this.ordersCaissierUrl, order).pipe(
      map(
        data => data
      )
    )
  }

  updateDebCuis(id:any):Observable<any>{
    return this.http.put<any>(this.EnPrep, id).pipe(
      map(
        map=> map
      )
    )
  }

  updateFinCuis(id:any):Observable<any>{
    return this.http.put<any>(this.FinPrep, id).pipe(
      map(
        map=> map
      )
    )
  }

  updateDebuLivr(id:any):Observable<any>{
    return this.http.put<any>(this.EnLivraison, id).pipe(
      (
        map=> map
      )
    )
  }

  updateFinLivraison(id:any):Observable<any>{
    return this.http.put<any>(this.FinLivraison, id).pipe(
      map(
        map=> map
      )
    )
  }

  updateOrder(id:any):Observable<Order> {
    return this.http.put<Order>(this.updateUrl,id);
  }

  listOrder(login:String): Observable<Order>{
    const url = this.orderUrl+"/"+login;
    return this.http.get<Order>(url);
  }

  listOrderItem(orderId:any):Observable<any>{
    const url = this.orderItemUrl + "/" + orderId;
    return  this.http.get<any>(url);
  }

  listSurplusD(orderItemId:any):Observable<any>{
    const url = this.orderDetails + "/" + orderItemId;
    return this.http.get<any>(url).pipe(
      map(
        res => res
      )
    )
  }

  listOrders():Observable<any>{
    return this.http.get(this.orders);
  }

  listOrderCuisine():Observable<Orders[]>{
    return this.http.get<Orders[]>(this.cuisineOrder).pipe(
      map(res=>res)
    );
  }

  getMyTicket(orderTr:any):Observable<any>{
    const url = this.orderTr+"/"+orderTr;
    return this.http.get<Order>(url).pipe(
      map(
        res => res
      )
    );
  }



}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from "rxjs";
import {Purchase} from '../../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // private purchaseUrl = 'https://posback.jcloud-ver-jpe.ik-server.com/orders';
  // private purchaseOnline = 'https://posback.jcloud-ver-jpe.ik-server.com/orders/Mob';

  private purchaseUrl = 'http://localhost:8080/orders';
  private purchaseOnline = 'http://localhost:8080/orders/Mob';
  constructor(private httpClient: HttpClient) {

  }

  placeOrder(purchase: Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  placeOrderOnLine(purchase: Purchase):Observable<any>{
    return this.httpClient.post<Purchase>(this.purchaseOnline, purchase);
  }
}

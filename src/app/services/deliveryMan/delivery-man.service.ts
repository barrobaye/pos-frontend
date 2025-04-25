import { Injectable } from '@angular/core';
import {DeliveryMan} from '../../common/deliveryMan';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {


  // private baseUrl = "https://posback.jcloud-ver-jpe.ik-server.com/deliveryMans";
   private baseUrl = "http://localhost:8080/deliveryMans";
  constructor(private http: HttpClient) { }

  loginD = "";
  isLoginDIn:boolean = false;
  getDeliveryManById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => data)
    );
  }



  deleteDeliveryMane(id:any):Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  createDelivery(DeliveryMan: DeliveryMan): Observable<any>{
    return this.http.post<any>(this.baseUrl, DeliveryMan);
  }

  listDeliveryMan():Observable<DeliveryMan>{
    return this.http.get<DeliveryMan>(this.baseUrl);
  }

  updateDeliveryMan(id:any,delivery:DeliveryMan):Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/${id}`,delivery).pipe(
      map(
        data =>data
      )
    )
  }

  connexionDeliveryMan(code:string):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/delivery-mans/${code}`).pipe(
        data => data
    )
  }

  setLoginD(log:string){
    this.loginD = log;
    sessionStorage.setItem('loginDelivery',log);
    localStorage.setItem('loginDelivery',log);
  }
  setLoginDIn(statut:boolean){
    this.isLoginDIn = statut;
  }

  getLoginDIn(){
    return this.isLoginDIn;
  }

  getLoginD(){
    const storedLogin = localStorage.getItem('loginDelivery');
    if(storedLogin){
      this.loginD = storedLogin;
      return this.loginD;
    }
    return this.loginD?.toString() || sessionStorage.getItem('loginDelivery');

  }



}

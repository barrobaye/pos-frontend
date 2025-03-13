import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Caissier} from '../../../common/caissier';

@Injectable({
  providedIn: 'root'
})
export class CaisseService {

  private caisseUrl = "https://posback.jcloud-ver-jpe.ik-server.com/caissier";
  private caisseUrl2 = "https://posback.jcloud-ver-jpe.ik-server.com/caissiers";
  private connexionUrl = "https://posback.jcloud-ver-jpe.ik-server.com/caissierConnexion";

  // private caisseUrl = "http://localhost:8080/caissier";
  // private caisseUrl2 = "http://localhost:8080/caissiers";
  // private connexionUrl = "http://localhost:8080/caissierConnexion";
  private isLoggedIn = false;
  private login!:any;
  constructor(private http: HttpClient) { }


  connexionCais(caissier:any):Observable<any>{
    return this.http.post<any>(this.connexionUrl,caissier).pipe(
      map(data => data )
    )
  }
  listCaissier():Observable<Caissier>{
    return this.http.get<Caissier>(this.caisseUrl2);
  }

  saveCaissier(caissier:Caissier):Observable<any>{
    return this.http.post<any>(this.caisseUrl2,caissier);
  }

  getCaissierById(id:number):Observable<Caissier>{
    let url = this.caisseUrl2+"/"+id;
    return this.http.get<Caissier>(url).pipe(
      map(res=> res)
    );
  }
  updateCaissier(caissier:Caissier,id:any):Observable<Caissier>{
    let url = this.caisseUrl+"/"+id;
    return this.http.put<Caissier>(url,caissier).pipe(
      map(res => res)
    );

  }

  deleteCaissier(id:any){
    let url = this.caisseUrl2+"/"+id;
    return this.http.delete(url);
  }

  loginV(login:String):Observable<any>{
    const url = this.caisseUrl+"/"+login;
    return this.http.get<Caissier>(url);
  }

  setLoginIn(status:boolean){
    this.isLoggedIn = status;
  }

  setLoginV(log:string){
    this.login = log;
    sessionStorage.setItem('login',log);
    localStorage.setItem('login',log);
  }
  getLoginIn(){
    return this.isLoggedIn;
  }
  getLoginV(){
    const storedLogin = localStorage.getItem('login');
    if(storedLogin){
      this.login = storedLogin;
      return this.login;
    }
    return this.login?.toString() || sessionStorage.getItem('login');
  }

  signOutCaissier(){
    localStorage.clear();
    sessionStorage.clear();
    // location.reload();
  }

}

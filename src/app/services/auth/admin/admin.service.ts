import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Admin} from '../../../common/admin';

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  private urlAdmin ="https://posback.jcloud-ver-jpe.ik-server.com/admins";
  private urlConnexion = "https://posback.jcloud-ver-jpe.ik-server.com/adminConnexion";
  private urlOAdmin = "https://posback.jcloud-ver-jpe.ik-server.com/admin";
  // private urlAdmin ="http://localhost:8080/admins";
  // private urlConnexion = "http://localhost:8080/adminConnexion";
  // private urlOAdmin = "http://localhost:8080/admin";
  login = "";
  isLoginIn:boolean = false;

  constructor(private http: HttpClient) { }

  getAdmin(id:any):Observable<Admin>{
    let url = this.urlAdmin +"/"+id;
    return this.http.get<Admin>(url).pipe(
      map(res=> res)
    );
  }

  getAdminByLog(login:any):Observable<any>{
    let url = this.urlOAdmin +"/"+login;
    return this.http.get<Admin>(url).pipe(
      map(res=> res)
    )
  }

  connexionAdmin(admin:any):Observable<Admin>{
    return this.http.post<Admin>(this.urlConnexion,admin).pipe(
      map(res=> res)
    );
  }

  setLoginA(log:string){
    this.login = log;
    sessionStorage.setItem('loginAdmin',log);
    localStorage.setItem('logAdmin',log);
  }
  setLoginIn(statut:boolean){
    this.isLoginIn = statut;
  }
  getLoginIn(){
    return this.isLoginIn;
  }
  getLoginA(){
    const storedLogin = localStorage.getItem('loginAdmin');
    if(storedLogin){
      this.login = storedLogin;
      return this.login
    }
    return this.login?.toString() || sessionStorage.getItem('loginAdmin');
  }
}

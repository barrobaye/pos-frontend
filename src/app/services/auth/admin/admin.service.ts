import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Admin} from '../../../common/admin';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})

export class AdminService {
 /*  private urlAdmin ="https://posback.jcloud-ver-jpe.ik-server.com/admins";
  private urlConnexion = "https://posback.jcloud-ver-jpe.ik-server.com/adminConnexion";
  private urlOAdmin = "https://posback.jcloud-ver-jpe.ik-server.com/admin"; */

  private urlAdmin ="http://localhost:8080/admins";
  private urlConnexion = "http://localhost:8080/adminConnexion";
  private urlOAdmin = "http://localhost:8080/admin";

  login = "";
  isLoginIn: boolean = false;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getAdmin(id: any): Observable<Admin> {
    let url = `${this.urlAdmin}/${id}`;
    return this.http.get<Admin>(url).pipe(map(res => res));
  }

  getAdminByLog(login: any): Observable<any> {
    let url = `${this.urlOAdmin}/${login}`;
    return this.http.get<Admin>(url).pipe(map(res => res));
  }

  connexionAdmin(admin: any): Observable<Admin> {
    return this.http.post<Admin>(this.urlConnexion, admin).pipe(map(res => res));
  }

  setLoginA(log: string) {
    this.login = log;
    this.storageService.setSessionStorageItem('loginAdmin', log);
    this.storageService.setLocalStorageItem('logAdmin', log);
  }

  setLoginIn(statut: boolean) {
    this.isLoginIn = statut;
  }

  getLoginIn() {
    return this.isLoginIn;
  }

  getLoginA() {
    const storedLogin = this.storageService.getLocalStorageItem('loginAdmin');
    if (storedLogin) {
      this.login = storedLogin;
      return this.login;
    }
    return this.login?.toString() || this.storageService.getSessionStorageItem('loginAdmin');
  }
 
 
}

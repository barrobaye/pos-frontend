import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductCategory} from '../../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  // private urlCategory = "https://posback.jcloud-ver-jpe.ik-server.com/categories";
   private urlCategory = "http://localhost:8080/categories";
  constructor(private http: HttpClient) { }


  saveCategory(Category:any):Observable<any>{
    return this.http.post<any>(this.urlCategory, Category);
  }

  listCategory():Observable<any>{
    return this.http.get<any>(this.urlCategory);
  }


}

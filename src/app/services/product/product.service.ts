import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ProductCategory} from '../../common/product-category';
import {Product} from '../../common/product';
import {ProductSup} from '../../common/productSup';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 /*  private baseUrl = "https://posback.jcloud-ver-jpe.ik-server.com/products";

  private categoryUrl = "https://posback.jcloud-ver-jpe.ik-server.com/categories";

  private productSupUrl = "https://posback.jcloud-ver-jpe.ik-server.com/productSup";
  private supleant = "https://posback.jcloud-ver-jpe.ik-server.com/surplus";
  private productCt = "https://posback.jcloud-ver-jpe.ik-server.com/productsCat"; */

  private baseUrl = "http://localhost:8080/products";
  
  private categoryUrl = "http://localhost:8080/categories";
  
  private productSupUrl = "http://localhost:8080/productSup";
  private supleant = "http://localhost:8080/surplus";
  
  private productCt = "http://localhost:8080/productsCat";

  constructor(private http: HttpClient) { }
  getProducts():  Observable<any[]> {
   // console.log (this.http.get<any[]>(this.baseUrl));
    return this.http.get<any[]>(this.baseUrl);
  }

  getCategories():  Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.categoryUrl).pipe(
      map(data => data)
    );
  }

  saveProduct(product:any):Observable<any>{
    return this.http.post<any>(this.baseUrl,product);
  }
  createProduct(produtSup:any):Observable<any>{
   return this.http.post<any>(this.productSupUrl,produtSup);
  }

  getProductById(id:any):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => data)
    )
  }

  updateProduct(id:any,p:Product ):Observable<Product>{
    return this.http.put<Product>(`${this.baseUrl}/${id}`,p).pipe(
      map(data => data)
    )
  }

  deleteProduct(id:any){
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  listSuplean(id:any):Observable<any>{
    return this.http.get(`${this.supleant}/${id}`).pipe(
      map(data => data )
    );
  }

  listProdCt(name:any):Observable<any>{
    let url = this.productCt + "/"+name;
    return this.http.get(url).pipe(
      map(data => data)
    )
  }

  // getProduct(theProductId: number): Observable<Product>{
  //   const productUrl = `${this.baseUrl}/${theProductId}`;
  //
  //   //no .pipe and using the interfaces to unwrap from _embedded entry bcs the json returned from spring dosent have it in this case
  //   return this.httpClient.get<Product>(productUrl);
  // }

  // getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts>{
  //
  //   const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
  //
  //   return this.httpClient.get<GetResponseProducts>(searchUrl);
  // }

//   searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts>{
//
//     const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;
//
//     return this.httpClient.get<GetResponseProducts>(searchUrl);
//   }
//
// }

// interface GetResponseProducts{
//   _embedded:{
//     products:Product[];
//   },
//   page: {
//     size: number,
//     totalElements: number,
//     totalPages: number,
//     number: number
//   }
// }
//
// interface GetResponseProductCategory{
//   _embedded:{
//     productCategory: ProductCategory[]
//   }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {ProductCategory} from '../../common/product-category';
import {Product} from '../../common/product';
import {ProductSup} from '../../common/productSup';
import { ApiUrlService } from '../../core/api-url.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

 /*  private baseUrl = "https://posback.jcloud-ver-jpe.ik-server.com/products";

  private categoryUrl = "https://posback.jcloud-ver-jpe.ik-server.com/categories";

  private productSupUrl = "https://posback.jcloud-ver-jpe.ik-server.com/productSup";
  private supleant = "https://posback.jcloud-ver-jpe.ik-server.com/surplus";
  private productCt = "https://posback.jcloud-ver-jpe.ik-server.com/productsCat"; */

/*   private baseUrl = "http://localhost:8080/products";
  private categoryUrl = "http://localhost:8080/categories";
  private productSupUrl = "http://localhost:8080/productSup";
  private supleant = "http://localhost:8080/surplus";
  private productCt = "http://localhost:8080/productsCat"; */

  private baseUrl: string;
  private categoryUrl: string;
 // private productSupUrl: string;
  private supleantUrl: string;
  private productCatUrl: string;

  constructor(
    private http: HttpClient,
    private apiUrlService: ApiUrlService
  ) {
    this.baseUrl = this.apiUrlService.getFullPath('/products');
    this.categoryUrl = this.apiUrlService.getFullPath('/categories');
    //this.productSupUrl = this.apiUrlService.getFullPath('/productSup');
    this.supleantUrl = this.apiUrlService.getFullPath('/surplus');
    this.productCatUrl = this.apiUrlService.getFullPath('/productsCat');
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.categoryUrl);
  }

  saveProduct(product: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, product);
  }

  getProductById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put(`${this.baseUrl}/${id}`, formData).pipe(
      map(response => {
        // Gestion des réponses vides (cas où vous faisiez .ok().build())
        if (response === null) {
        //  return { id } as Product;
        // Si vous avez besoin d'une réponse vide, vous pouvez retourner un objet vide ou null
          return {} as Product; // ou null;
        }
        return response as Product;
      }),
      catchError(error => {
        // Si le message d'erreur est une string, la convertir en objet d'erreur
        if (typeof error.error === 'string') {
          throw { error: { message: error.error } };
        }
        throw error;
      })
    );
  }

  deleteProduct(id: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  listSuplean(id: any): Observable<any> {
    return this.http.get(`${this.supleantUrl}/${id}`);
  }

  listProdCt(name: any): Observable<any> {
    return this.http.get(`${this.productCatUrl}/${name}`);
  }
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


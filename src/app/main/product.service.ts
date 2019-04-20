import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Subject } from 'rxjs';
import { Product } from './product.model';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProductService {

  private products: Product[];
  private productsUpdated = new Subject<{products: Product[], count: number}>();

  constructor(private http: HttpClient) {}

  getProducts(productsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, products: any, count: number}>('http://localhost:3000/api/products' + queryParams)
      .pipe(map(productData => {
        return { transformedProducts: productData.products.map( product => {
          return {
            id: product.ID,
            productName: product.PRODUCTNAME,
            productNumber: product.PRODUCTNUMBER,
            productColor: product.PRODUCTCOLOR,
            releaseDate: new Date(product.RELEASEDATE),
            manufacturer: product.MANUFACTURER,
            price: product.PRICE,
            quantity: product.QUANTITY,
            productType: product.PRODUCTTYPE
          };
        }),
         count: productData.count[0].COUNT};
      })
      )
      .subscribe((productData) => {
        this.products = productData.transformedProducts;
        this.productsUpdated.next({products:[...this.products], count: productData.count});
      });
  }

  getProductUpdateListener(){
    return this.productsUpdated.asObservable();
  }

}

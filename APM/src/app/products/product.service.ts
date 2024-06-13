import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, combineLatest, map, merge, Observable, scan, share, shareReplay, Subject, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductCategoryService } from '../product-categories/product-category.service';
import { SupplierService } from '../suppliers/supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = 'api/suppliers';

  // Make an HTTP GET request to this.productsUrl which should return an array of Product objects
  // Assign to products$
  products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      // tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
    );
  
  // Combine this.products$ and this.ProductCategoryService.productCategories$
  productsWithCategory$ = combineLatest([
    this.products$,
    this.ProductCategoryService.productCategories$
  ]).pipe(
    // Map the combined observables into a new array of Product objects
    map(([products, categories]) =>
      products.map(product => ({
        ...product,
        price: product.price ? product.price * 1.5 : 0,
        // Find the ProductCategory object that matches the product.categoryId
        // and assign the name of that category to the product.category property
        category: categories.find(c => product.categoryId === c.id)?.name,
        searchKey: [product.productName]
      } as Product))
    ),
    shareReplay(1)  // Cache the last emitted value so that it can be reused by a new subscriber
  );

  // Selected product action stream
  private productSelectedSubject = new BehaviorSubject<number>(0);
  productSelectedAction$ = this.productSelectedSubject.asObservable();

  // Find 'Product' object that corresponds to the 'selectedProductId' and assign to 'selectedProduct$'
  selectedProduct$ = combineLatest([
    this.productsWithCategory$,
    this.productSelectedAction$
  ]).pipe(
    map(([products, selectedProductId]) =>
      // Find the product with an id that matches the selectedProductId
      // Selects the product with the ID emitted by this.productSelectedAction$
      products.find(product => product.id === selectedProductId)
    ),
    tap(product => console.log('selectedProduct', product)),
    shareReplay(1)  // Cache the last emitted value so that it can be reused by a new subscriber
  );

  // productInsertedAction$ action stream
  private productInsertedSubject = new Subject<Product>();
  productInsertedAction$ = this.productInsertedSubject.asObservable();

  // Combine productInsertedAction$ action stream to data stream
  productsWithAdd$ = merge(
    this.productsWithCategory$,
    this.productInsertedAction$
  ).pipe(
    scan((acc, value) =>
      // If value is an array, make a copy of that array
      // If not, make a copy of the accumulator array and add the value to it
      // Add an empty array of products to the accumulator to type it correctly
      (value instanceof Array) ? [...value] : [...acc, value], [] as Product[])
  )

  constructor(private http: HttpClient,
              private ProductCategoryService: ProductCategoryService,
              private supplerService: SupplierService) { }

  // Emits 'newProduct' to 'productInsertedSubject' when called
  addProduct(newProduct?: Product) {
    // If 'newProduct' is 'true', then assign it to 'newProduct'
    // Else, assign 'this.fakeProduct' to 'newProduct'
    newProduct = newProduct || this.fakeProduct();
    this.productInsertedSubject.next(newProduct);
  }

  // Emits the value of the 'selectedProductId' to the 'productSelectedSubject' when called
  selectedProductChanged(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
  }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      category: 'Toolbox',
      quantityInStock: 30
    };
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

}

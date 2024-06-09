import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { EMPTY, Subject, Subscription, catchError } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';

  // errorMessage$ action stream
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // Declarative approach
  // Subscribe to 'productsWithCategory$' observable from ProductService
  products$ = this.productService.productsWithCategory$
    .pipe(
      catchError(err => {
        // Emit error message to 'errorMessage$' action stream
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  selectedProduct$ = this.productService.selectedProduct$;

  constructor(private productService: ProductService) { }

  // Calls 'selectedProductChanged' method from 'productService', passing in the 'productId'
  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}

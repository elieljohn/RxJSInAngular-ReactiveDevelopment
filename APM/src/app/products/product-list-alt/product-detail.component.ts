import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductService } from '../product.service';
import { EMPTY, Subject, catchError, map } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  // Error message action stream
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  // Emits a string in the given format for each product emitted by product$
  pageTitle$ = this.product$
    .pipe(
      // Transforms the values emitted by 'product$'
      // If 'p' is truthy, it returns a string with the specified format
      // Else, it returns null
      map(p => p ? `Product Detail for: ${p.productName}` : null)
    )

  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  constructor(private productService: ProductService) { }

}

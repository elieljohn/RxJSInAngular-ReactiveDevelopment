import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Subject, catchError, combineLatest, map } from 'rxjs';

import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Component is checked only when (1) @Input properties change, (2) event emits, or (3) a bound Observable emits
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  // Action Stream
  // Private Subject instance which emits a <number>
  private categorySelectedSubject = new Subject<number>();
  // Public Observable instance which can be subscribed to
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // Observable that emits an array of Product objects, filtered based on the selected category
  // Combine productsWithCategory$ from ProductService with categorySelectedAction$
  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ]).pipe(
      map(([products, selectedCategoryId]) =>
        // If selectedCategoryId is true (selected), check if product.categoryId matches selectedCategoryId
        // If no category is selected, set return to matching condition to 'true', returning all products
        products.filter(product =>
          selectedCategoryId ? product.categoryId === selectedCategoryId : true
        )),
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      );

  // Subscribe to 'categories$' observable from ProductCategoryService
  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService ) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  // Emits the 'categoryId' numeric value to 'CategorySelectedSubject' when a category is selected on the UI
  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}

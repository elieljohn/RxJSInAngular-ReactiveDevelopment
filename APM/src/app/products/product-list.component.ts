import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, catchError, map } from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';
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
  selectedCategoryId = 1;

  // Declarative approach
  // Subscribe to 'products$' observable from ProductService
  products$ = this.productService.productsWithCategory$
    .pipe(
      // Error handling
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

  // Filter Product objects based on the selected category
  // If no category is selected, the observable emits the full list
  productsSimpleFilter$ = this.productService.productsWithCategory$
    .pipe(
      map(products =>
        products.filter(product =>
          // If this.selectedCategoryId is true, check if product.categoryId matches with this.selectedCategoryId
          // If false (this.selectedCategoryId is not selected), the condition is set to always true, returning all products
          this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : true
        )
      )
    )

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService ) { }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.selectedCategoryId = +categoryId;
  }
}

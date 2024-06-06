import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';

import { ProductCategory } from '../product-categories/product-category';
import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  categories: ProductCategory[] = [];

  products$: Observable<Product[]> | undefined ;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    // Assign the observable returned by getProducts to 'products$'
    this.products$ = this.productService.getProducts()
      .pipe(
        // Error handling
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      );
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}

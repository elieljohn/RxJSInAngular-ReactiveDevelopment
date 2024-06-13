import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable, of, map, tap, concatMap, mergeMap, switchMap } from 'rxjs';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  // Makes individual HTTP GET requests for each ID
  suppliersWithMap$ = of(1, 5, 8)
    .pipe(
      map(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  // Emits an observable for each ID that was passed
  // Each emitted observable will be the result of 'this.http.get<Supplier>()'
  suppliersWithConcatMap$ = of(1, 5, 8)
    .pipe(
      tap(id => console.log('concatMap source Observable', id)),
      // concatMap: HTTP requests are made in a sequential manner
      concatMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  // Emits an observable for each ID that was passed
  // Each emitted observable will be the result of 'this.http.get<Supplier>()'
  suppliersWithMergeMap$ = of(1, 5, 8)
    .pipe(
      tap(id => console.log('mergeMap source Observable', id)),
      // mergeMap: HTTP requests are made in parallel
      // Results are emitted as they become available (sequence is unpredictable)
      // Can improve performance
      mergeMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  // Emits an observable for each ID that was passed
  // 'switchMap' cancels any previous inner observables when a new one is emitted from the source observable
  suppliersWithSwitchMap$ = of(1, 5, 8)
    .pipe(
      tap(id => console.log('switchMap source Observable', id)),
      switchMap(id => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`))
    );

  constructor(private http: HttpClient) {
    // Subscribe to log the 'item' value to the console
    // this.suppliersWithConcatMap$.subscribe(item => console.log('concatMap result', item));
    // this.suppliersWithMergeMap$.subscribe(item => console.log('mergeMap result', item));
    // this.suppliersWithSwitchMap$.subscribe(item => console.log('switchMap result', item));

    // // eslint-disable-next-line rxjs/no-nested-subscribe
    // this.suppliersWithMap$.subscribe(o => o.subscribe(
    //   // Inner subscribe to subscribe to each observable returned by 'this.suppliersWithMap$'
    //   // It then logs the 'item' value to the console
    //   item => console.log('map result', item)
    // ));
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

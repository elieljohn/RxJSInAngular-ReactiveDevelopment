import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { of, from, map, tap, take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'rxjs-test';

  ngOnInit(): void {
      // of(2, 4, 6, 8).subscribe(item => console.log(item));

      from([20, 15, 10, 5]).pipe(
        // Tap is used to perform side-effects for notifications from the source observable
        tap(item => console.log(`emitted item .... ${item}`)),

        // Map applies a function to each item and returns the value as a new observable
        map(item => item * 2),
        map(item => item - 10),
        map(item => {
          if (item === 0) {
            throw new Error('zero detected');
          }
          return item;
        }),

        // Take emits only the specified number of items
        take(3)
      )
      .subscribe({
        next: (item) => console.log(`resulting item.. ${item}`),
        error: (err) => console.log(`error occurred ${err}`),
        complete: () => console.log('complete')
      })

      // of('Apple1', 'Apple2', 'Apple3').subscribe({
      //   next: (apple) => console.log(`Apple emitted ${apple}`),
      //   error: (err) => console.log(`Error occurred ${err}`),
      //   complete: () => console.log('No more apples, go home')
      // })
  }
}

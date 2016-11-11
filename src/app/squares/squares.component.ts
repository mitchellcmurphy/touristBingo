import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Squares` component loaded asynchronously');

@Component({
  selector: 'squares',
  styleUrls: [ './squares.component.css' ],
  templateUrl: './squares.component.html'
})
export class SquaresComponent {
  items: FirebaseListObservable<any[]>;
  localState: any;
  boxes = [
      {
          title: 'title',
          text: 'text'
      }
  ]
  constructor(public route: ActivatedRoute, af: AngularFire) {
      this.items = af.database.list('/items');
  }

  ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    console.log('hello `Squares` component');
  }
}

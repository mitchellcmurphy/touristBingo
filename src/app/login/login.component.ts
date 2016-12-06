import { Component } from '@angular/core';
import { AngularFire, FirebaseAuth } from 'angularfire2';

console.log('`Login` component loaded asynchronously');

@Component({
  selector: 'login',
  styleUrls: [ './login.component.css' ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
    user = {};

  constructor(
    public af: AngularFire,
    public auth: FirebaseAuth) {
        this.af.auth.subscribe(user => {
            if(user) {
                // user logged in
                this.user = user;
            }
            else {
                // user not logged in
                this.user = {};
            }
        });
  }

  ngOnInit() {
    console.log('hello `Login` component');
  }

  login() {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }
}

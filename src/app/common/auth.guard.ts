import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AngularFire } from 'angularfire2';


@Injectable()
export class AuthGuard implements CanActivate {
    user = {};
  constructor(
      private router: Router,
      public af: AngularFire) {}

  canActivate() {
    // Check to see if a user has a valid JWT
    console.log("SHITS", this.af.auth);
    if (this.user != {}) {
      // If they do, return true and allow the user to load the home component
      return true;
    }

    // If not, they redirect them to the login page
    this.router.navigate(['/login']);
    return false;
  }
}
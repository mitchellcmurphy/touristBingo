import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { UserService } from './user.service'


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
      private router: Router,
      public af: AngularFire,
      private userService: UserService) {}

  canActivate() {
    // Check to see if a user has a valid JWT
    var user = this.userService.getUser();
		console.log("Current user", user);
    if (user && user.uid) {
      // If they do, return true and allow the user to load the home component
      return true;
    }

    // If not, they redirect them to the login page and preserve the wanted path
    this.router.navigate(['/login']);
    return false;
  }
}
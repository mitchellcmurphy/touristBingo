import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Injectable()
export class UserService {
    user = {};

    constructor(public af: AngularFire) {
      this.af.auth.subscribe(user => {
            if(user) {
                // user logged in
                this.user = user;
                console.log("Logged in", user);
            }
            else {
                // user not logged in
                this.user = {};
                console.log("Not logged in");
            }
        });
  }

  getUser(){
      return this.user;
  }
}
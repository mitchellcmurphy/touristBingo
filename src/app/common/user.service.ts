import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';

console.log('User Service loaded');

@Injectable()
export class UserService {
	user: any;
	private redirectUrl: string;

	constructor(
		public af: AngularFire,
		private router: Router,) {
			this.af.auth.subscribe(user => {
				if(user) {
					// user logged in
					this.user = user;
					console.log("Logged in", user);

					//Check if user exists, if not add user
					this.checkOrSetUser();

					this.redirectThePage();
				}
				else {
					// user not logged in
					this.user = null;
					console.log("Not logged in");
				}
		});
	}

  getUser(){
		return this.user;
  }

  getRedirectUrl(){
		return this.redirectUrl;
  }

  setRedirectUrl(url: string){
		if(url){
			this.redirectUrl = url;
		}
  }

  clearRedirectUrl(){
		this.redirectUrl = null;
  }

  checkOrSetUser(){
		this.af.database.object(`/users/${this.user.uid}`).subscribe((obj) => {
			if (!obj.$exists()) {
				// object does not exist, add new user
				console.log("New user sign in", this.user);
				const userRef = this.af.database.object(`/users/${this.user.uid}`);
				userRef.set(
					{
							email : this.user.auth.email
					}
				);
			}
		});
  }

	redirectThePage(){
		let redirectUrl = localStorage.getItem('redirectUrl');
		if(redirectUrl){
			console.log("Redirecting to:", redirectUrl);
			// localStorage.clear('redirectUrl');
			this.router.navigate([redirectUrl]);
		}
		else{
			this.router.navigate(['/home']);
		}

		// this.router.navigate(['/home']);
	}
}
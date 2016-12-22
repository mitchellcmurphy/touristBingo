/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { CollapseDirective } from 'ng2-bootstrap'
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { UserService } from './common/user.service'


import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `
  <div class="sidebar-nav">
    <div class="navbar navbar-default" role="navigation" *ngIf="showMenu === true">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".sidebar-navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <span class="visible-xs navbar-brand">Tourist Bingo</span>
      </div>
      <div class="navbar-collapse collapse sidebar-navbar-collapse">
        <ul class="nav navbar-nav">
          <li><a href="#/home">User Home</a></li>
          <!--<li><a href="#/game">Game</a></li>-->
          <li><a href="#/creation-tool">Creation Tool</a></li>
          <li><a (click)=signOut()>Logout</a></li>
          <!--<li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown<b class="caret"></b></a>
            <ul class="dropdown-menu">
              <li><a href="#">Whatever</a></li>
              <li><a href="#">Whatever2</a></li>
              <li><a href="#">Whatever4</a></li>
            </ul>
          </li>-->
        </ul>
      </div><!--/.nav-collapse -->
    </div>

    <main>
      <router-outlet></router-outlet>
    </main>

    <span defaultOverlayTarget></span>
  `
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';
  public isCollapsed: boolean = true
  user = {};
  routerSub: any;
  public showMenu: boolean = false;

  constructor(
    public appState: AppState,
    public af: AngularFire,
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);

    this.routerSub = this.router.events.subscribe((val) => {
      if(val.url != '/login'){
        this.showMenu = true;
      }
      else{
        this.showMenu = false;
      }
    });
  }

  signOut() {
    this.af.auth.logout();
    this.router.navigate(['/login']);
  }
}
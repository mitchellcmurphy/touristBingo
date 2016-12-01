/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { CollapseDirective } from 'ng2-bootstrap'

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
    <div class="navbar navbar-default" role="navigation">
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
          <li><a href="#/squares">Game</a></li>
          <li><a href="#/creation-tool">Creation Tool</a></li>
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

    <!--<footer>
      <div>
        Footer Stuffs
      </div>
    </footer>-->
  `
})
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';
  public isCollapsed: boolean = true

  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */

import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { AngularFireModule, FIREBASE_PROVIDERS, AuthProviders, AuthMethods, firebaseAuthConfig } from 'angularfire2';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { CollapseDirective } from 'ng2-bootstrap'

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { XLarge } from './home/x-large';
import { GameComponent } from './game';
import { CreationToolComponent } from './creation-tool';
import { ImgModalWindow } from './modal-img/modal-img';
import { ImgViewModalWindow } from './modal-view-entry/modal-view-entry';
import { CreateGameModalWindow } from './modal-create-game/modal-create-game';
import { LoginComponent } from './login';
import { AuthGuard } from './common/auth.guard'
import { UserService } from './common/user.service'

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

//Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyCzG1IQAkNJLr8hXcqgStltB897BMs_jK8",
  authDomain: "touristbingo-2a6b3.firebaseapp.com",
  databaseURL: "https://touristbingo-2a6b3.firebaseio.com",
  storageBucket: "touristbingo-2a6b3.appspot.com",
  messagingSenderId: "889266554830"
};

export const myFirebaseAuthConfig = {
  provider: AuthProviders.Google,
  method: AuthMethods.Redirect
}

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    NoContentComponent,
    XLarge,
    GameComponent,
    CreationToolComponent,
    ImgModalWindow,
    ImgViewModalWindow,
    CreateGameModalWindow,
    CollapseDirective,
    LoginComponent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true }),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    ModalModule.forRoot(),
    BootstrapModalModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    AuthGuard,
    UserService
  ],
  entryComponents: [ 
    ImgModalWindow,
    ImgViewModalWindow,
    CreateGameModalWindow
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}

  hmrOnInit(store: StoreType) {
    if (!store || !store.state) return;
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues  = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}


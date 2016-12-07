import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { AppState } from '../app.service';
import { Title } from './title';
import { XLarge } from './x-large';

import { UserService } from '../common/user.service'
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { CreateGameModalWindow, SetNewGameData } from '../modal-create-game/modal-create-game';

@Component({
  selector: 'home',  // <home></home>
  providers: [
    Title
  ],
  styleUrls: [ './home.component.css' ],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  private user: any;
  private displayName: string;
  games: FirebaseListObservable<any[]>;

  constructor(
    public appState: AppState, 
    public title: Title,
    private userService: UserService,
    public modal: Modal,
    public af: AngularFire) {
      this.user = userService.getUser();
      if(this.user){
        //Set some display values
        this.displayName = this.user.auth.displayName;
        //Set the games list
        this.games = this.af.database.list('/users/' + this.user.uid + '/games');
      }
  }

  ngOnInit() {
    console.log('hello `Home` component');
  }

  createGame(){
    return this.modal.open(CreateGameModalWindow,  overlayConfigFactory(
      {
        owner: this.user.uid
      }, BSModalContext));
  }
}

import { Component } from '@angular/core';

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

  constructor(
    public appState: AppState, 
    public title: Title,
    private userService: UserService,
    public modal: Modal) {
      this.user = userService.getUser();
      if(this.user){
        //Set some display values
        this.displayName = this.user.auth.displayName;
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

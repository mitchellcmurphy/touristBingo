import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

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
    public af: AngularFire,
    private router: Router) {
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

  switchGame(game){
    this.router.navigate(['/game/' + game.gameKey]);
  }

  deleteGame(game: any){
    //Delete any associated files
    var gameItems = this.af.database.list('/games/' + game.$key + '/cards', { preserveSnapshot: true});
    console.log(game.cards);
    for (var key in game.items) {
      var obj = game.items[key];
      console.log("Deleting object:", obj);
      if(obj.fileName){
        firebase.storage().ref().child('images/' + obj.fileName).delete().then(snapshot => console.log('file deleted'));
      }
    }
    this.games.remove(game.$key).then(_ => console.log('game deleted!'));
  }
}

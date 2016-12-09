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
        owner: this.user.uid,
        ownerEmail: this.user.auth.email
      }, BSModalContext));
  }

  switchGame(game){
    this.router.navigate(['/game/' + game.gameKey]);
  }

  deleteGame(game: any, $event: any){
    $event.stopPropagation();
    //Delete any associated files
    // var gameItems = this.af.database.list('/games/' + game.$key + '/cards', { preserveSnapshot: true});
    // console.log(game);
    // for (var key in game.items) {
    //   var obj = game.items[key];
    //   console.log("Deleting object:", obj);
    //   if(obj.fileName){
    //     firebase.storage().ref().child('images/' + obj.fileName).delete().then(snapshot => console.log('file deleted'));
    //   }
    // }
    // this.games.remove(game.$key).then(_ => console.log('game deleted!'));
    this.filesSub = this.af.database.list('/games/' + game.gameKey + '/files', { preserveSnapshot: true})
    .subscribe(snapshots=>{
      if(snapshots.length === 0){
        console.log("We have no more files to delete, deleting game object");
        this.af.database.list('/games').remove(game.gameKey).then(_ => console.log('game deleted from db!'));
      }
      console.log(snapshots);
      snapshots.forEach(snapshot => {
        if(snapshot.val().fileName){
          let fileName = snapshot.val().fileName;
          let fileKey = snapshot.key;
          console.log("File found", fileName);
          firebase.storage().ref().child('images/' + fileName).delete().then(snapshot => 
          {
            console.log('file deleted');
            this.af.database.list('/games/' + game.gameKey + '/files').remove(fileKey).then(_ => console.log("file ref deleted"));
          });
        }
      });
    });
    this.games.remove(game.$key).then(_ => console.log('game deleted from user!'));
  }
}

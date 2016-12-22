import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';

import { GameService } from '../common/game.service'

export class SetNewGameData extends BSModalContext {
  public owner: string
  public ownerEmail: string
}

@Component({
  selector: 'modal-content',
  styles: [``],
    templateUrl: './modal-create-game.html'
})
export class CreateGameModalWindow implements ModalComponent<SetNewGameData> {
  context: SetNewGameData;
  topics: FirebaseListObservable<any[]>;
  games: FirebaseListObservable<any[]>;
  cards: FirebaseListObservable<any[]>;
  gameName: string;
  selectedTopic: any;
  playersToAdd: any;
  playerInts: number[] = [1,2,3,4,5];
  numberOfPlayers: number;
  public creatingGame = false;

  constructor(
    public dialog: DialogRef<SetNewGameData>, 
    public af: AngularFire,
    private router: Router,
    private gameService: GameService) {
    this.context = dialog.context;
    this.topics = af.database.list('/topics');
   }

  setTopic(topic: any){
    this.selectedTopic = topic;
  }

  setNumberOfPlayers(numberOfPlayers){
    this.playersToAdd = [];
      var input = parseInt(numberOfPlayers);
      this.numberOfPlayers = input;
      console.log("Players to add", input)
      this.playersToAdd.push({
        email: this.context.ownerEmail
      });
      for(let i = 1; i < input; i++){
        this.playersToAdd.push({
          email: "Email " + (i + 1)
        });
      }
  }

  closeModal(){
    this.dialog.close();
  }

  createAndCloseModal(){
    this.creatingGame = true;
    console.log(this.selectedTopic.listItems);
    console.log("number to generate", this.numberOfPlayers);
    let newGameRef = this.gameService.createGame(this.gameName, 
                                                 this.context.owner, 
                                                 this.numberOfPlayers, 
                                                 this.selectedTopic.listItems, 
                                                 this.playersToAdd);
    setTimeout( () => {
      this.dialog.close();
      this.router.navigate(['/game/' + newGameRef.key]);
    },1000);
  }
}

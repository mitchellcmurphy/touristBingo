import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';

export class SetNewGameData extends BSModalContext {
  public owner: string
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
  selectedTopic: any;
  playersToAdd: any;
  playerInts: number[] = [1,2,3,4,5];
  numberOfPlayers: number;
  public creatingGame = false;

  constructor(public dialog: DialogRef<SetNewGameData>, public af: AngularFire) {
    this.context = dialog.context;
    this.topics = af.database.list('/topics');
    this.games = af.database.list('/games');
  }

  setTopic(topic: any){
    this.selectedTopic = topic;
  }

  doneTypingCreateGame($event) {
    if($event.which === 13) {
      this.playersToAdd = [];
      var input = parseInt($event.target.value);
      this.numberOfPlayers = input;
      console.log("Players to add", input)
      for(let i = 0; i < input; i++){
        this.playersToAdd.push({
          email: "New Player"
        });
      }
    }
  }

  setNumberOfPlayers(numberOfPlayers){
    this.playersToAdd = [];
      var input = parseInt(numberOfPlayers);
      this.numberOfPlayers = input;
      console.log("Players to add", input)
      for(let i = 0; i < input; i++){
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
    var newGameRef = this.games.push({
      gameOwner: this.context.owner
    });
    //Add the game key to the owner
    this.af.database.list('/users/' + this.context.owner + '/games').push(
      {
        gameKey: newGameRef.key
      }
    );
    for(var i = 0; i < this.numberOfPlayers; i++){
      var listItems = [];
      for (var key in this.selectedTopic.listItems) {
        var obj = this.selectedTopic.listItems[key];
        listItems.push(obj.itemName);
      }

      var newCardRef = this.af.database.list('/games/' + newGameRef.key + '/cards').push(
        {
          cardOwnerEmail: this.playersToAdd[i].email
        }
      );

      // var newCardRef = this.cards.push({
      //   cardOwnerEmail: this.playersToAdd[i].email
      // });

      var newItems = this.getRandom(listItems, 25);

      for(var j = 0; j < newItems.length; j++){
        this.af.database.list('/games/' + newGameRef.key + '/cards/' + newCardRef.key + '/squares').push(newItems[j]);
      }
    }
    this.dialog.close();
  }

  getRandom(arr, n) {
    var chooser = this.randomNoRepeats(arr);
    var result = new Array(n),
        len = arr.length;
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        result[n] = {
          name: chooser()
        };
    }
    return result;
  }

  randomNoRepeats(array) {
    var copy = array.slice(0);
    return function() {
      if (copy.length < 1) { copy = array.slice(0); }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
  };
}

}

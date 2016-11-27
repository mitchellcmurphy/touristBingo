import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';

export class SetNewGameData extends BSModalContext {

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
  selectedTopic: any;
  playersToAdd: any;
  playerInts: number[] = [1,2,3,4,5];
  numberOfPlayers: number;

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
          playerName: "New Player"
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
          playerName: "Player " + (i + 1)
        });
      }
  }

  closeModal(){
    this.dialog.close();
  }

  createAndCloseModal(){
    console.log(this.selectedTopic.listItems);
    console.log("number to generate", this.numberOfPlayers);
    for(var i = 0; i < this.numberOfPlayers; i++){
      var listItems = [];
      for (var key in this.selectedTopic.listItems) {
        var obj = this.selectedTopic.listItems[key];
        listItems.push(obj.itemName);
      }

      var newGameRef = this.games.push({
        gameName: this.playersToAdd[i].playerName
      });

      var newItems = this.getRandom(listItems, 25);

      for(var j = 0; j < newItems.length; j++){
        this.af.database.list('/games/' + newGameRef.key + '/items').push(newItems[j]);
      }
    }
    this.dialog.close();
  }

  getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = {
          name: arr[x in taken ? taken[x] : x]
        };
        taken[x] = --len;
    }
    return result;
  }
}

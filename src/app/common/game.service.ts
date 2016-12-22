import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

console.log('Game Service loaded');

@Injectable()
export class GameService {
  game: FirebaseObjectObservable<any>;
	gameSub: any;

	constructor(
		public af: AngularFire
	) {}

  getGame(){
		return this.game;
  }

  setGameDataById(gameId: string){
		if(this.gameSub){this.gameSub.unsubscribe();}
		this.gameSub = this.af.database.object('/games/' + gameId)
		.subscribe(gameObject=>{
			console.log("Game object received", gameObject);
			for (var key in gameObject.cards) {
				console.log(gameObject.cards[key]);
			}
			this.game = gameObject;
		});
  }

  clearGame(){
		this.game = null;
  }

	createGame(gameName: string, owner: string, numberOfPlayers: number, listItemsInput: any, playersToAdd: any){
		var newGameRef = this.af.database.list('/games').push({
      gameName: gameName,
      gameOwner: owner
    });
    //Add the game key to the owner
    var gameData = {
      gameName: gameName,
      gameKey: newGameRef.key,
      gameOwner: owner
    }
    this.af.database.list('/users/' + owner + '/games').push(gameData);
    for(var i = 0; i < numberOfPlayers; i++){
      var listItems = [];
      for (var key in listItemsInput) {
        var obj = listItemsInput[key];
        listItems.push(obj.itemName);
      }

      var newCardRef = this.af.database.list('/games/' + newGameRef.key + '/cards').push(
        {
          cardOwnerEmail: playersToAdd[i].email
        }
      );

      var newItems = this.getRandom(listItems, 25);

      for(var j = 0; j < newItems.length; j++){
        this.af.database.list('/games/' + newGameRef.key + '/cards/' + newCardRef.key + '/squares').push(newItems[j]);
      }
    }
		//Return the game ref for navigating
		return newGameRef;
	}

	getRandom(arr, n) {
    var chooser = this.randomNoRepeats(arr);
    var result = new Array(n),
        len = arr.length;
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
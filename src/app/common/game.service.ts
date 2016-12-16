import { Injectable } from '@angular/core';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

console.log('Game Service loaded');

@Injectable()
export class GameService {
  game: FirebaseObjectObservable<any>;
	gameSub: any;
	winLines: [
		{
			row1:[0,1,2,3,4]
		}
	]

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
}
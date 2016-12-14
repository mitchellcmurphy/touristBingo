import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ImgModalWindow, SetImgData } from '../modal-img/modal-img';
import { ImgViewModalWindow, SetImgUrlData } from '../modal-view-entry/modal-view-entry';
import { CreateGameModalWindow, SetNewGameData } from '../modal-create-game/modal-create-game';
import { UserService } from '../common/user.service'
import { GameService } from '../common/game.service'
import { CarouselModule } from 'ng2-bootstrap/ng2-bootstrap';

console.log('`Game` component loaded asynchronously');

@Component({
  selector: 'game',
  styleUrls: [ './game.component.css' ],
  templateUrl: './game.component.html',
  providers: [Modal]
})
export class GameComponent {
  squares: FirebaseListObservable<any[]>;
  cards: FirebaseListObservable<any[]>;
  storageRef: any;
  currentCard: any;
  user: any;
  gameId: string;
  gameData: any;
  updateUserSub: any;
  paramsSub: any;
  authedForGame: boolean = false;
  authCleared: boolean = false;

  constructor(
    public route: ActivatedRoute, 
    private userService: UserService,
    private gameService: GameService,
    public af: AngularFire, 
    public modal: Modal,
    private router: Router) {
      this.user = userService.getUser();
  }

  ngOnInit() {
    this.storageRef = firebase.storage().ref();
    console.log('hello `Game` component');
    // Subscribe to route params
    this.paramsSub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.cards = this.af.database.list('/games/' + id + '/cards');
      this.gameId = id;
      this.gameService.setGameDataById(id);
      //Reset the booleans in case this is just a param change
      this.authedForGame = false;
      this.authCleared = false;

      //Update user info on card if logging in to game for first time
      this.updateUserInfo(id);
    });
  }

  updateUserInfo(id: string){
    this.updateUserSub = this.af.database.list('/games/' + id + '/cards', { preserveSnapshot: true}).subscribe(cards=>{
        cards.forEach(card => {
          console.log("snapshot", card.key, card.val().cardOwnerEmail, this.user.auth.email);
          if(card.val().cardOwnerEmail == this.user.auth.email){
            this.authedForGame = true;
            console.log("Authed to play");
            this.cards.update(card.key,
            {
              userName: this.user.auth.displayName
            });
            this.squares = this.af.database.list('/games/' + this.gameId + '/cards/' + card.key + '/squares');
            this.currentCard = {
              $key: card.key,
              userName: this.user.auth.displayName
            }
            //If this isn't the game owner, add the game to the account
            //*Game is already in game owner's account*
            //Since this data is fired before we set game data in the service, we need to
            //quickly subscribe here then dump it once we checked
            this.addGameToUser()
          }
        });
        if(this.authedForGame === false){
          //This user is not authed for this game, should not be able to play
          console.log("Not authed to play");
          this.authCleared = true;
        }
      });
  }

  addGameToUser(){
    var gameSub = this.af.database.object('/games/' + this.gameId)
    .subscribe(gameObject=>{
      if(gameObject && gameObject.gameOwner && gameObject.gameOwner != this.user.uid){
        //Check that the game hasn't already been added
        var userGames = this.af.database.object('/users/' + this.user.uid + '/games', { preserveSnapshot: true})
        .subscribe(games => {
          let addGame = true;
          games.forEach(game => {
            // console.log("This", game.val().gameKey, this.gameId);
            if(game.val().gameKey == this.gameId){
              addGame = false;
            }
          });
          if(addGame === true){
            this.af.database.list('/users/' + this.user.uid + '/games').push({
              gameKey: gameObject.$key,
              gameName: gameObject.gameName,
              gameOwner: gameObject.gameOwner
            });
            // userGames.unsubscribe();
          }
          userGames.unsubscribe();
        });
      }
      gameSub.unsubscribe();  
    });
    this.updateUserSub.unsubscribe();
  }

  prepareToUploadPicture($event, square: any) {
    return this.modal.open(ImgModalWindow,  overlayConfigFactory(
      { 
        imgData: $event.srcElement.files[0],
        squareRef: square,
        gameKey: this.gameId,
        cardKey: this.currentCard.$key
      }, BSModalContext));
  }

  switchCard(card: any){
    this.squares = this.af.database.list('/games/' + this.gameId + '/cards/' + card.$key + '/squares');
    this.currentCard = card;
  }

  showImg(url: string, itemRef: any){
    return this.modal.open(ImgViewModalWindow,  overlayConfigFactory(
      { 
        fileUrl: url,
        itemRef: itemRef
      }, BSModalContext));
  }

  ngOnDestroy() {
    if(this.updateUserSub){this.updateUserSub.unsubscribe();}
    if(this.paramsSub){this.paramsSub.unsubscribe();}
  }
}

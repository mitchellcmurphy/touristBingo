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
  updateUserSub: any;

  constructor(
    public route: ActivatedRoute, 
    private userService: UserService,
    public af: AngularFire, 
    public modal: Modal,
    private router: Router) {
      this.user = userService.getUser();
  }

  ngOnInit() {
    this.storageRef = firebase.storage().ref();
    console.log('hello `Game` component');
    // Subscribe to route params
    this.sub = this.route.params.subscribe(params => {
      let id = params['id'];
      this.cards = this.af.database.list('/games/' + id + '/cards');
      this.gameId = id;

      //Update user info on card if logging in to game for first time
      this.updateUserSub = this.af.database.list('/games/' + id + '/cards', { preserveSnapshot: true}).subscribe(snapshots=>{
        let authedForGame = false;
        snapshots.forEach(snapshot => {
          console.log("snapshot", snapshot.key, snapshot.val().cardOwnerEmail, this.user.auth.email);
          if(snapshot.val().cardOwnerEmail == this.user.auth.email){
            authedForGame = true;
            console.log("Authed to play");
            this.cards.update(snapshot.key,
            {
              userName: this.user.auth.displayName
            });
          }
        });
        if(authedForGame === false){
          //This user is not authed for this game, should not be able to play
          console.log("Not authed to play");
          this.router.navigate(['/login']);
        }
      });
    });
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
  }
}

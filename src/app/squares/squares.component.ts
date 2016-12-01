import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ImgModalWindow, SetImgData } from '../modal-img/modal-img';
import { ImgViewModalWindow, SetImgUrlData } from '../modal-view-entry/modal-view-entry';
import { CreateGameModalWindow, SetNewGameData } from '../modal-create-game/modal-create-game';
// import { EXIF } from 'exif-js';

console.log('`Squares` component loaded asynchronously');

@Component({
  selector: 'squares',
  styleUrls: [ './squares.component.css' ],
  templateUrl: './squares.component.html',
  providers: [Modal]
})
export class SquaresComponent {
  items: FirebaseListObservable<any[]>;
  games: FirebaseListObservable<any[]>;
  topics: FirebaseListObservable<any[]>;
  localState: any;
  storageRef: any;
  currentGame: any;
  selectedTopic: any;
  uploadingBox: string;

  constructor(public route: ActivatedRoute, public af: AngularFire, public modal: Modal) {
      this.games = af.database.list('/games');
      this.topics = af.database.list('/topics');
  }

  ngOnInit() {
    this.storageRef = firebase.storage().ref();
    console.log('hello `Squares` component');
  }

  prepareToUploadPicture($event, item: any) {
    // EXIF.getData($event.srcElement.files[0], function(){
    //   var allMetaData = EXIF.getAllTags(this);
    //   console.log(allMetaData);
    // });
    return this.modal.open(ImgModalWindow,  overlayConfigFactory(
      { 
        imgData: $event.srcElement.files[0],
        itemRef: item,
        gameKey: this.currentGame.$key
      }, BSModalContext));
  }

  deleteGame(game: any){
    //Delete any associated files
    var gameItems = this.af.database.list('/games/' + game.$key + '/items', { preserveSnapshot: true});
    console.log(game.items);
    for (var key in game.items) {
      var obj = game.items[key];
      console.log("Deleting object:", obj);
      if(obj.fileName){
        firebase.storage().ref().child('images/' + obj.fileName).delete().then(snapshot => console.log('file deleted'));
      }
    }
    this.games.remove(game.$key).then(_ => console.log('game deleted!'));
  }

  switchGame(game: any){
    this.items = this.af.database.list('/games/' + game.$key + '/items');
    this.currentGame = game;
  }

  setTopic(topic: any){
    this.selectedTopic = topic;
  }

  showImg(url: string, itemRef: any){
    return this.modal.open(ImgViewModalWindow,  overlayConfigFactory(
      { 
        fileUrl: url,
        itemRef: itemRef
      }, BSModalContext));
  }

  createGame(){
    return this.modal.open(CreateGameModalWindow,  overlayConfigFactory(
      {       }, BSModalContext));
  }
}

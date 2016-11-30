import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { ImgModalWindow, SetImgData } from '../modal-img/modal-img';
import { ImgViewModalWindow, SetImgUrlData } from '../modal-view-entry/modal-view-entry';
import { CreateGameModalWindow, SetNewGameData } from '../modal-create-game/modal-create-game';
import { EXIF } from 'exif-js';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

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
  // af: AngularFire;
  currentGame: any;
  selectedTopic: any;
  uploadingBox: string;

  constructor(public route: ActivatedRoute, public af: AngularFire, public modal: Modal) {
      // this.items = af.database.list('/items');
      // this.af = af;
      this.games = af.database.list('/games');
      this.topics = af.database.list('/topics');
  }

  ngOnInit() {
    this.storageRef = firebase.storage().ref();
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    console.log('hello `Squares` component');
  }

  addToGame(box: HTMLInputElement) {
    console.log('box=',box)
    this.items.push({
      name: box.value
    });
    box.value = null;
  }

  doneTyping($event) {
    if($event.which === 13) {
      this.items.push({
        name: $event.target.value
      });
      $event.target.value = null;
    }
  }

  doneTypingGame($event) {
    if($event.which === 13) {
      this.games.push({
        gameName: $event.target.value
      });
      $event.target.value = null;
    }
  }

  prepareToUploadPicture($event, item: any) {
    EXIF.getData($event.srcElement.files[0], function(){
      var allMetaData = EXIF.getAllTags(this);
      console.log(allMetaData);
    });
    return this.modal.open(ImgModalWindow,  overlayConfigFactory(
      { 
        imgData: $event.srcElement.files[0],
        itemRef: item
      }, BSModalContext));
  }

  deleteCell(item: any){
    //Delete the associated file
    if(item.fileName){
      firebase.storage().ref().child('images/' + item.fileName).delete()
      .then(
        snapshot => console.log('file deleted')
      )
      .catch(function(error){
        console.log("File delete error", error);
      });
    }
    //Delete the cell metadata
    this.items.remove(item.$key).then(_ => console.log('item deleted!'));
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

  addGame(game: HTMLInputElement) {
    console.log('game=',game)
    this.games.push({
      gameName: game.value
    });
    game.value = null;
  }

  setTopic(topic: any){
    this.selectedTopic = topic;
  }

  generateGame(numberOfCards: any){
    console.log(this.selectedTopic.listItems);
    var parsedNumber = parseInt(numberOfCards.value);
    console.log("number to generate", parsedNumber);
    for(var i = 0; i < parsedNumber; i++){
      var listItems = [];
      for (var key in this.selectedTopic.listItems) {
        var obj = this.selectedTopic.listItems[key];
        listItems.push(obj.itemName);
      }

      var newGameRef = this.games.push({
        gameName: UUID.UUID()
      });

      var newItems = this.getRandom(listItems, 25);

      for(var j = 0; j < newItems.length; j++){
        this.af.database.list('/games/' + newGameRef.key + '/items').push(newItems[j]);
      }
    }
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

  showImg(url: string, itemRef: any){
    // return this.modal.open(ImgModalWindow,  overlayConfigFactory({ url: "google.com/stuff" }, BSModalContext));
    // var body = '<span>' + name + '</span><img width=100% src="' + url +'">';
    // this.modal.alert()
    //     .size('lg')
    //     .showClose(true)
    //     .title('Cell Image')
    //     .body(body)
    //     .open();
    return this.modal.open(ImgViewModalWindow,  overlayConfigFactory(
      { 
        fileUrl: url,
        itemRef: itemRef
      }, BSModalContext));
  }

  uploadFile($event) {
    var files = $event.srcElement.files;
    $event.stopPropagation();
    $event.preventDefault();
    var file = files[0];
    var metadata = {
      'contentType': file.type
    };
    var filename = file.name + UUID.UUID();
    firebase.storage().ref().child('images/' + filename).put(file, metadata).then(snapshot => console.log("FIGARO!"));
  }

  createGame(){
    return this.modal.open(CreateGameModalWindow,  overlayConfigFactory(
      {       }, BSModalContext));
  }
}

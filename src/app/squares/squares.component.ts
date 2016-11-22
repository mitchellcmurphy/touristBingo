import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { ImgModalWindow, SetImgUrlData } from '../modal-img/modal-img';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Squares` component loaded asynchronously');

@Component({
  selector: 'squares',
  styleUrls: [ './squares.component.css' ],
  templateUrl: './squares.component.html'
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

  uploadPicture($event, item: any) {
    var key = item.$key;
    this.uploadingBox = item.name;
    var files = $event.srcElement.files;
    $event.stopPropagation();
    $event.preventDefault();
    var file = files[0];
    var metadata = {
      'contentType': file.type
    };
    var filename = file.name + UUID.UUID();
    firebase.storage().ref().child('images/' + filename).put(file, metadata).then(snapshot => this.obtainUploadUrl(snapshot, key, filename));
  }

  obtainUploadUrl(snapshot: any, key: string, name: string){
    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
    console.log(snapshot.metadata);
    var url = snapshot.metadata.downloadURLs[0];
    console.log('File available at', url);
    // this.updateSquareWithData(key, {
    //   fileUrl: url,
    //   fileName: name
    // });

    //HACK TODO FIX THIS WITH DATABASE LATER
    this.af.database.list('/games', { preserveSnapshot: true})
    .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          console.log("shits", snapshot.key, snapshot.val().items);
          var gameKey = snapshot.key;
          for (var key in snapshot.val().items) {
            var obj = snapshot.val().items[key];
            console.log("shits again", obj);
            if(obj.name === this.uploadingBox){
              var itemsToUpdate = this.af.database.list('/games/' + gameKey + '/items');
              itemsToUpdate.update(key, {
                fileUrl: url,
                fileName: name
              });
            }
          }

          // for(var i = 0; i < snapshot.val().items.length; i++){
          //   console.log("shits again", snapshot.val().items[i]);
          //   if(snapshot.val().items[i].name === this.uploadingBox){
          //     this.af.database.list('/games/' + gameKey + '/items').update(snapshot.val().items[i].$key, {
          //       fileUrl: url,
          //       fileName: name
          //     });
          //   }
          // }
        });
    })
  }

  updateSquareWithData(key: string, data: Object){
    console.log("Updating", key, "With", data);
    var updateItems = this.af.database.list('/games/' + this.currentGame.$key + '/items');
    console.log("BALLS", updateItems);
    updateItems.remove(key);
    // this.af.database.list('/games/' + this.currentGame.$key + '/items').update(key, data);
    // this.items.update(key, data).then(_ => console.log('update!'));
  };

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
      console.log(obj);
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
    console.log("number to generate", numberOfCards.value);
    for(var i = 0; i < parseInt(numberOfCards.value); i++){
      var listItems = [];
      for (var key in this.selectedTopic.listItems) {
        var obj = this.selectedTopic.listItems[key];
        listItems.push(obj.itemName);
      }
      // this.games.push({
      //   gameName: UUID.UUID(),
      //   items: this.getRandom(listItems, 25)
      // });
      var newGameRef = this.games.push({
        gameName: UUID.UUID()
      });

      var newItems = this.getRandom(listItems, 25);

      for(var i = 0; i < newItems.length; i++){
        this.af.database.list('/games/' + newGameRef.key + '/items').push(newItems[i]);
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

  showImg(url: string){
    // this.modal.open(ImgModalWindow, new SetImgUrlData(url));
    var body = '<img width=100% src="' + url +'">';
    this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('Cell Image')
        .body(body)
        .open();
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
}

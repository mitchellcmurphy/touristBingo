import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Modal } from 'angular2-modal/plugins/bootstrap';

console.log('`Creation Tool` component loaded asynchronously');

@Component({
  selector: 'creation-tool',
  styleUrls: [ './creation-tool.component.css' ],
  templateUrl: './creation-tool.component.html'
})
export class CreationToolComponent {
  topics: FirebaseListObservable<any[]>;
  listItems: FirebaseListObservable<any[]>;
  localState: any;
  af: AngularFire;
  currentTopicName: string;

  constructor(public route: ActivatedRoute, af: AngularFire, public modal: Modal) {
    this.af = af;
    this.topics = af.database.list('/topics');
  }

  ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    console.log('hello `Creation Tool` component');
  }

  doneTypingTopic($event) {
    if($event.which === 13) {
      this.topics.push({
        topicName: $event.target.value
      });
      $event.target.value = null;
    }
  }

  doneTypingListItem($event) {
    if($event.which === 13) {
      // this.listItems.push({
      //   itemName: $event.target.value
      // });
      this.addToItemList($event.target.value);
      $event.target.value = null;
    }
  }

  deleteItem(item: any){
    this.listItems.remove(item.$key).then(_ => console.log('item deleted!'));
  }

  deleteTopic(topic: any){
    //Delete any associated files
    // var gameItems = this.af.database.list('/games/' + game.$key + '/items', { preserveSnapshot: true});
    // console.log(game.items);
    // for (var key in game.items) {
    //   var obj = game.items[key];
    //   console.log(obj);
    //   if(obj.fileName){
    //     firebase.storage().ref().child('images/' + obj.fileName).delete().then(snapshot => console.log('file deleted'));
    //   }
    // }
    this.topics.remove(topic.$key).then(_ => console.log('topic deleted!'));
  }

  switchTopic(topic: any){
    this.listItems = this.af.database.list('/topics/' + topic.$key + '/listItems');
    this.currentTopicName  = topic.topicName;
  }

  addTopic(topic: HTMLInputElement) {
    console.log('topic=',topic)
    this.topics.push({
      topicName: topic.value
    });
    topic.value = null;
  }

  addToTopic(item: HTMLInputElement) {
    console.log('item=',item)
    this.addToItemList(item.value);
    // this.listItems.push({
    //   itemName: item.value
    // });
    item.value = null;
  }

  addToItemList(name: string){
    // for (var key in this.listItems) {
    //   var obj = this.listItems[key];
    //   console.log(obj.value);
      // if(obj.fileName){
      //   firebase.storage().ref().child('images/' + obj.fileName).delete().then(snapshot => console.log('file deleted'));
      // }
    // }
    this.listItems.push({
      itemName: name
    });
  }

  showModal(){
    this.modal.alert()
        .size('lg')
        .showClose(true)
        .title('Duplicate Entry')
        .body(`
          <span>That item already exists, try again</span>
        `)
        .open();
  }
}

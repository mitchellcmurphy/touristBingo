import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

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
  localState: any;
  storageRef: any;

  updateSquareWithData = (key: string, data: Object) => {
    console.log("Updating", key, "With", data);
    this.items.update(key, data).then(_ => console.log('update!'));
    // window.location.reload(true);
  }

  constructor(public route: ActivatedRoute, af: AngularFire) {
      this.items = af.database.list('/items');
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

  addToCart(person: HTMLInputElement) {
    console.log('person=',person)
    this.items.push({
      name: person.value
    });
    person.value = null;
  }

  doneTyping($event) {
    if($event.which === 13) {
      this.items.push({
        name: $event.target.value
      });
      $event.target.value = null;
    }
  }

  uploadPicture($event, key: string) {
    var files = $event.srcElement.files;
    $event.stopPropagation();
    $event.preventDefault();
    var file = files[0];
    var metadata = {
      'contentType': file.type
    };
    firebase.storage().ref().child('images/' + file.name).put(file, metadata).then(snapshot => this.obtainUploadUrl(snapshot, key));
  }

  obtainUploadUrl(snapshot: any, key: string){
    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      console.log(snapshot.metadata);
      var url = snapshot.metadata.downloadURLs[0];
      console.log('File available at', url);
      this.updateSquareWithData(key, {
        fileUrl: url
      });
  }

  deleteCell(key: string){
    this.items.remove(key).then(_ => console.log('item deleted!'));
  }
}

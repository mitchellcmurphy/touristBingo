import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';

export class SetImgUrlData extends BSModalContext {
  public url: string;
  public imgData: any;
  public itemRef: any;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'modal-content',
  styles: [`
        .custom-modal-container {
            padding: 15px;
        }

        .custom-modal-header {
            background-color: #219161;
            color: #fff;
            -webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
            margin-top: -15px;
            margin-bottom: 40px;
        }
    `],
    templateUrl: './modal-img.html'
})
export class ImgModalWindow implements ModalComponent<SetImgUrlData> {
  context: SetImgUrlData;
  fileData: any;
  uploadingBox: string;

  public wrongAnswer: boolean;

  constructor(public dialog: DialogRef<SetImgUrlData>, public af: AngularFire) {
    this.context = dialog.context;
    this.wrongAnswer = true;

    let reader = new FileReader();
    reader.onload = (e) => {
        this.fileData = reader.result;
    };
    reader.readAsDataURL(this.context.imgData);
  }

  onKeyUp(value) {
    this.wrongAnswer = value != 5;
    this.dialog.close();
  }


  beforeDismiss(): boolean {
    return true;
  }

  beforeClose(): boolean {
    return this.wrongAnswer;
  }

  uploadAndCloseModal(){
    var key = this.context.itemRef.$key;
    this.uploadingBox = this.context.itemRef.name;
    var metadata = {
      'contentType': this.context.imgData.type
    };
    var filename = this.context.imgData.name + UUID.UUID();
    firebase.storage().ref().child('images/' + filename)
      .put(this.context.imgData, metadata)
        .then(snapshot => this.obtainUploadUrl(snapshot, key, filename));

    this.dialog.close();
  }

  obtainUploadUrl(snapshot: any, key: string, name: string){
    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
    console.log(snapshot.metadata);
    var url = snapshot.metadata.downloadURLs[0];
    console.log('File available at', url);

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
        });
    })
  }
}

import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { UUID } from 'angular2-uuid';

export class SetImgData extends BSModalContext {
  public imgData: any;
  public squareRef: any;
  public gameKey: string;
  public cardKey: string;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'modal-content',
  styles: [``],
  templateUrl: './modal-img.html'
})
export class ImgModalWindow implements ModalComponent<SetImgData> {
  context: SetImgData;
  fileData: any;
  uploadingBox: string;
  updateSub: any;

  constructor(public dialog: DialogRef<SetImgData>, public af: AngularFire) {
    this.context = dialog.context;

    let reader = new FileReader();
    reader.onload = (e) => {
        this.fileData = reader.result;
    };
    reader.readAsDataURL(this.context.imgData);
  }

  closeModal(){
    this.dialog.close();
  }

  uploadAndCloseModal(){
    var key = this.context.squareRef.$key;
    //Set the uploading gif
    var itemsToUpdate = this.af.database.list('/games/' + this.context.gameKey + '/cards/' + this.context.cardKey + '/squares');
    itemsToUpdate.update(key, {
      updating: true
    });
    this.uploadingBox = this.context.squareRef.name;
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
    this.updateSub = this.af.database.list('/games/' + this.context.gameKey + '/cards', { preserveSnapshot: true})
    .subscribe(snapshots=>{
        snapshots.forEach(snapshot => {
          console.log("snapshot", snapshot.key, snapshot.val().squares);
          var cardKey = snapshot.key;
          for (var key in snapshot.val().squares) {
            var obj = snapshot.val().squares[key];
            console.log("Current iterated obj", obj);
            if(obj.name === this.uploadingBox){
              var itemsToUpdate = this.af.database.list('/games/' + this.context.gameKey + '/cards/' + cardKey + '/squares');
              itemsToUpdate.update(key, {
                fileUrl: url,
                fileName: name
              });
            }
          }
        });
    })
  }

  ngOnDestroy() {
    if(this.updateSub){this.updateSub.unsubscribe();}
  }
}

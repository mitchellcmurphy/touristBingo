import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class SetImgUrlData extends BSModalContext {
  constructor(public url: string) {
    super();
    console.log(url);
  }
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
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */ template: `
        <img src="https://firebasestorage.googleapis.com/v0/b/touristbingo-2a6b3.appspot.com/o/images%2FnatAndMeSmaller.jpg255b4a48-3b02-72d0-0f31-3cb1a76c7ef9?alt=media&token=742bd58b-4fd3-4a3c-941c-03eef85c741c">`
})
export class ImgModalWindow implements ModalComponent<SetImgUrlData> {
  context: SetImgUrlData;

  public wrongAnswer: boolean;

  constructor(public dialog: DialogRef<SetImgUrlData>) {
    this.context = dialog.context;
    this.wrongAnswer = true;
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
}

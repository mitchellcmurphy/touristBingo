import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class SetImgUrlData extends BSModalContext {
  public url: string;
  public imgData: any;
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

  public wrongAnswer: boolean;

  constructor(public dialog: DialogRef<SetImgUrlData>) {
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

  closeModal(){
    this.dialog.close();
  }
}

import { Component } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
declare var Hammer: any

export class SetImgUrlData extends BSModalContext {
  public fileUrl: string;
  public itemRef: any;
}

@Component({
  selector: 'modal-content',
  styles: [``],
  templateUrl: './modal-view-entry.html'
})
export class ImgViewModalWindow implements ModalComponent<SetImgUrlData> {
  context: SetImgUrlData;
  SWIPE_ACTION = { 
    LEFT: 'swipeleft', 
    RIGHT: 'swiperight',
    UP: 'swipeup',
    DOWN: 'swipedown'
  };

  constructor(public dialog: DialogRef<SetImgUrlData>) {
    this.context = dialog.context;
  }

  ngAfterViewInit(){
    var modalElement = document.getElementById('viewImgBody');
    console.log(modalElement);
    if(modalElement){
      var hammertime = new Hammer(modalElement);
      hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
      console.log("Made it");
    }
  }

  // swipe(action = this.SWIPE_ACTION.DOWN){
  //   console.log("swipe event", action);
  //   if (action === this.SWIPE_ACTION.DOWN) {
  //           this.closeModal();
  //       }
  // }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    console.log("swipe event", action);
    this.closeModal();
  }

  closeModal(){
    this.dialog.close();
  }
}

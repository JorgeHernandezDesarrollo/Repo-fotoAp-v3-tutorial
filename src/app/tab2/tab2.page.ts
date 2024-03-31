import { Component } from '@angular/core';
//Añadido por Jorge
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular';
//Fin de añadido por Jorge

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  //constructor() {}
  //Añadido por Jorge
  constructor(public photoService: PhotoService,
              public actionSheetController: ActionSheetController) {}

  addPhotoToGallery(){
    this.photoService.addNewToGallery();
  }

  async ngOnInit(){
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo:UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Borrar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          //No hace nada. Action sheet se cierra automáticamente
        }
      }]
    });
    await actionSheet.present();
  }
  //Fin de añadido por Jorge

}

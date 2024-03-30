import { Component } from '@angular/core';
//Añadido por Jorge
import { PhotoService } from '../services/photo.service';
//Fin de añadido por Jorge

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  //constructor() {}
  //Añadido por Jorge
  constructor(public photoService: PhotoService) {}

  addPhotoToGallery(){
    this.photoService.addNewToGallery();
  }

  async ngOnInit(){
    await this.photoService.loadSaved();
  }
  //Fin de añadido por Jorge

}

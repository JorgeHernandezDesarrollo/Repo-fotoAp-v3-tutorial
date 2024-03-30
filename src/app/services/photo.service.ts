import { Injectable } from '@angular/core';

//Añadido por Jorge
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

import {Platform} from '@ionic/angular';
//Fin de añadido por Jorge

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
   }

  //Añadido por Jorge
  public async addNewToGallery() {
    //Hacer una foto
    const fotoHecha = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    /*
    this.photos.unshift({
      filepath: "soon...",
      webviewPath: fotoHecha.webPath!
    })
    */
    //Guardar la foto y añadirla a la colección
    const savedImageFile = await this.savePicture(fotoHecha);
    this.photos.unshift(savedImageFile);
    Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }
  
  private async savePicture(photo: Photo) {
    //Convertir foto al formato base64, requerido por la API del sistema de ficheros para guardarla
    const base64Data = await this.readAsBase64(photo);

    //Escribir el fichero en el directorio de datos
    const fileName = Date.now()+'jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
    //Usar webPath para mostrar la nueva imagen en lugar de base64, ya que ya está cargada en memoria
    return {
      filepath:fileName,
      webviewPath: photo.webPath
    };    
  }
  private async readAsBase64(photo: Photo){
    //Buscar la foto, leerla en bruto, entonces convertirla a formato base64
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
  });

  public async loadSaved(){
    //Recuperar los datos cacheados del array de fotos
    const {value} = await Preferences.get({key: this.PHOTO_STORAGE});
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];
    //Mostrar la foto leyendo en formato base64
    for (let photo of this.photos) {
      //Leer los datos de cada foto guardada en el sistema de ficheros
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      //Solo para la plataforma web: cargar la foto como datos base64
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }
  //Fin de añadido por Jorge
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}


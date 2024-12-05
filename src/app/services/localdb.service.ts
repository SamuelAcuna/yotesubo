import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class LocaldbService {
  constructor(private storage: Storage) {
    this.storage.create(); // Inicializa el almacenamiento
  }

  // Guardar datos
  saveData(key: string, value: any) {
    this.storage.set(key, value);
  }

  // Recuperar datos
  getData(key: string) {
    return this.storage.get(key);
  }

  // Eliminar datos
  removeData(key: string) {
    this.storage.remove(key);
  }

  // Limpiar todo
  clearData() {
    this.storage.clear();
  }
  async saveImage(key: string, image: string): Promise<void> {
    await this.saveData(key, image);
  }
}

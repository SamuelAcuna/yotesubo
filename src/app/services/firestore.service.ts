import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // Obtener todos los documentos de una colección
  getCollection<T>(collectionName: string): Observable<T[]> {
    return this.firestore.collection<T>(collectionName).valueChanges();
  }

  // Obtener un documento por ID de una colección
  getDocument<T>(collectionName: string, docId: string): Observable<T | null> {
    return this.firestore.collection(collectionName).doc<T>(docId).valueChanges().pipe(
        map(data => data ? data : null) // Si el documento no existe, devuelve null
    );
  }

  // Agregar un nuevo documento a una colección
  addDocument<T>(collectionName: string, data: T) {
    return this.firestore.collection(collectionName).add(data);
  }

  // Actualizar un documento por ID
  updateDocument<T>(collectionName: string, docId: string, data: T) {
    // Asegúrate de que data no esté vacío o undefined
    if (data && Object.keys(data).length > 0) {
      return this.firestore.collection(collectionName).doc(docId).update(data);
    } else {
      throw new Error('Data is empty or invalid');
    }
  }

  // Eliminar un documento por ID
  deleteDocument(collectionName: string, docId: string) {
    return this.firestore.collection(collectionName).doc(docId).delete();
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { map, Observable } from 'rxjs';
import { Car } from '../interfaces/cars';
import { User } from '../interfaces/user';
import { Viaje } from '../interfaces/viajes';


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

  // Obtener autos por ID de usuario
  getCarsByUserId(userId: string): Observable<Car[]> {
    return this.firestore.collection<Car>('cars', ref => ref.where('userId', '==', userId))
      .valueChanges();
  }
  getViajes(): Observable<Viaje[]> {
    return this.firestore.collection('viajes').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Viaje;
        const id = a.payload.doc.id;
        return { id, ...data }; // Retorna los datos del viaje junto con el ID
      }))
    );
  }
  getViajeById(id: string): Observable<Viaje | null> {
    return this.firestore.collection('viajes').doc<Viaje>(id).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data();
        return data ? { id, ...data } : null; // Incluye el ID en el objeto si existe
      })
    );
  }

  getUserByUid(uid: string): Observable<User[]> {
    return this.firestore
      .collection<User>('users', ref => ref.where('uid', '==', uid)) // Asegúrate de que 'users' sea el nombre de la colección
      .valueChanges();
  }

  agregarPasajero(viajeId: string, pasajero: any): Promise<any> {
    const pasajerosCollection = this.firestore.collection('viajes').doc(viajeId).collection('pasajeros');
    return pasajerosCollection.add(pasajero);  // Regresa un Promise<any>, que es lo adecuado para compatibilidad
  }
  getAllUsers(): Observable<User[]> {
    return this.firestore.collection<User>('user').valueChanges();
  }
  // Método para obtener los viajes de un usuario como pasajero
  getViajesComoPasajero(usuarioId: string): Observable<any[]> {
    return this.getViajes().pipe(
      map(viajes => 
        viajes.filter(viaje => viaje.pasajeros.some(pasajero => pasajero.uid === usuarioId)) // Filtra los viajes
      )
    );
  }

  // Método para obtener los viajes de un usuario como conductor
  getViajesComoConductor(usuarioId: string): Observable<any[]> {
    return this.firestore
      .collection('viajes', ref => ref.where('userId', '==', usuarioId))
      .valueChanges();
  }


}

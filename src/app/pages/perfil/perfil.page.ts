import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/interfaces/user';
import { Car } from 'src/app/interfaces/cars';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  
  userID: string = '';
  user: User | null = null;
  cars: Car[] = [];
  constructor(
    private authService: AuthService, 
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.userID = userId;
        console.log('User ID:', this.userID); // Verifica el userID aquí
        this.loadUsers(); // Llamar al método para cargar todos los usuarios
        this.loadUserCars(userId); // Llamar al método para cargar los autos del usuario
      } else {
        console.log('No se encontró un usuario autenticado');
      }
    });
  }

  loadUserCars(userId: string) {
    this.firestoreService.getCarsByUserId(userId).subscribe((cars) => {
      this.cars = cars;
      console.log('Autos del usuario:', this.cars);
    });
  }
  loadUsers() {
    console.log('Buscando todos los usuarios...');
    this.firestoreService.getAllUsers().subscribe((usersData) => {
      const foundUser = usersData.find(user => user.uid === this.userID); // Busca el usuario por UID
      if (foundUser) {
        this.user = foundUser; // Asigna el usuario encontrado
        console.log('Usuario personalizado encontrado:', this.user);
      } else {
        console.log('No se encontró el usuario con el UID proporcionado');
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Car } from 'src/app/interfaces/cars';
import { EstadoViaje, Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-crearviaje',
  templateUrl: './crearviaje.page.html',
  styleUrls: ['./crearviaje.page.scss'],
})
export class CrearviajePage implements OnInit {
  today: string;
  userID: string = '';
  cars: Car[] = [];
  comuna: string = '';
  fecha: string = '';
  carId: string = '';
  asientosDisponibles: number = 1;
  precio: number = 0;
  descripcion: string = '';
  selectedCar: string = '';  // Auto seleccionado


  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastController: ToastController) {
    const now = new Date();
    // Formato: YYYY-MM-DDTHH:mm
    this.today = now.toISOString();
    this.fecha = this.today;
  }

  createTrip(form: any) {
    if (form.valid) {
      const nuevoViaje: Viaje = {
        userId: this.userID,
        comuna: this.comuna,
        destino: 'Destino',
        fecha: this.fecha.toString(),
        hora: this.fecha.split('T')[1],
        asientosTotales: this.asientosDisponibles,
        asientosDisponibles: this.asientosDisponibles,
        precio: this.precio,
        carId: this.selectedCar,
        imagen: 'https://example.com/viaje-imagen.png',
        pasajeros: [],
        estado: EstadoViaje.Disponible,
        descripcion: this.descripcion,
        isActive: true,
      };
      console.log('Viaje creado:', nuevoViaje);
      this.firestoreService.addDocument('viajes', nuevoViaje)
      .then(() => {
        console.log('Viaje creado exitosamente');
        this.showToast('Viaje creado exitosamente');
        this.router.navigate(['/detalleviaje-conductor'], { state: { viaje: nuevoViaje } });
        // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
      })
      .catch((error) => {
        console.error('Error al crear el viaje:', error);
        // Aquí podrías mostrar un mensaje de error si ocurre algún problema
      });
      // Aquí puedes llamar a tu servicio para guardar el viaje
    } else {
      console.log('Formulario inválido');
    }
  }
  ngOnInit() {
    // Esperamos a que el usuario esté disponible antes de asignarlo
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.userID = userId;
        this.loadUserCars(userId);
        console.log('User ID:', this.userID); // Asegúrate de que se haya asignado correctamente
        console.log('Autos del usuario',this.cars);
      }
    });
  }
  
  loadUserCars(userId: string) {
    this.firestoreService.getCarsByUserId(userId).subscribe((cars) => {
      this.cars = cars;
      console.log('Autos del usuario:', this.cars);
    });
  }
  
  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  incrementSeats() {
    const input = document.getElementById('asientosDisponibles') as HTMLInputElement;
    let currentValue = parseInt(input.value, 10);
    if (currentValue < 4) { // Cambia 10 por el máximo que desees
      input.value = (currentValue + 1).toString();
      this.asientosDisponibles += 1;
    }
  }
  
  decrementSeats() {
    const input = document.getElementById('asientosDisponibles') as HTMLInputElement;
    let currentValue = parseInt(input.value, 10);
    if (currentValue > 1) { // Cambia 1 por el mínimo que desees
      input.value = (currentValue - 1).toString();
      this.asientosDisponibles -= 1;
    }
  }
  
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}

import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  viajes: Viaje[] = [];
  viajesComoConductor: Viaje[] = [];
  viajesComoPasajero: Viaje[] = [];
  usuarioActivoId: string = '';

  constructor(private authService: AuthService, private firestoreService: FirestoreService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.usuarioActivoId = userId;
        this.loadViajes();
      }
    });
    this.loadViajesFromLocalStorage();
  }

  // Método para verificar la conexión
  isOnline(): boolean {
    return navigator.onLine; // Verifica si hay conexión a Internet
  }

  loadViajes() {
    // Verificar si hay conexión
    if (this.isOnline()) {
      // Si hay conexión, hacer la consulta a Firebase
      this.loadViajesFromApi();
    }
  }

  // Cargar viajes desde la API (Firebase)
  loadViajesFromApi() {
    this.firestoreService.getViajesComoConductor(this.usuarioActivoId).subscribe(
      (viajesConductor) => {
        this.viajesComoConductor = viajesConductor;
        this.filter();
        console.log('Viajes como conductor:', this.viajesComoConductor);

        // Guardar en localStorage
        localStorage.setItem('viajesComoConductor', JSON.stringify(this.viajesComoConductor));
      },
      (error) => {
        console.error('Error al cargar viajes desde Firebase:', error);
        // Si hay un error, intentar cargar desde localStorage
        this.loadViajesFromLocalStorage();
      }
    );

    this.firestoreService.getViajesComoPasajero(this.usuarioActivoId).subscribe(
      (viajesPasajero) => {
        this.viajesComoPasajero = viajesPasajero;
        this.filter();
        console.log('Viajes como pasajero:', this.viajesComoPasajero);

        // Guardar en localStorage
        localStorage.setItem('viajesComoPasajero', JSON.stringify(this.viajesComoPasajero));
      },
      (error) => {
        console.error('Error al cargar viajes desde Firebase:', error);
        // Si hay un error, intentar cargar desde localStorage
        this.loadViajesFromLocalStorage();
      }
    );
  }

  // Cargar viajes desde localStorage
  loadViajesFromLocalStorage() {
    const storedViajesConductor = localStorage.getItem('viajesComoConductor');
    if (storedViajesConductor) {
      try {
        this.viajesComoConductor = JSON.parse(storedViajesConductor);
        console.log('Viajes como conductor cargados desde localStorage:', this.viajesComoConductor);
      } catch (e) {
        console.error('Error al parsear los viajes de conductor desde localStorage', e);
        this.viajesComoConductor = [];
      }
    } else {
      console.log('No se encontraron viajes en localStorage.');
    }

    const storedViajesPasajero = localStorage.getItem('viajesComoPasajero');
    if (storedViajesPasajero) {
      try {
        this.viajesComoPasajero = JSON.parse(storedViajesPasajero);
        console.log('Viajes como pasajero cargados desde localStorage:', this.viajesComoPasajero);
      } catch (e) {
        console.error('Error al parsear los viajes de pasajero desde localStorage', e);
        this.viajesComoPasajero = [];
      }
    } else {
      console.log('No se encontraron viajes en localStorage.');
    }
  }

  filter() {
    this.viajesComoConductor = this.viajesComoConductor.filter(viaje => viaje.isActive);
    this.viajesComoPasajero = this.viajesComoPasajero.filter(viaje => viaje.isActive);
  }

  ver(id: string) {
    const navigationExtras: NavigationExtras = {
      state: { id: id },
    };
    this.router.navigate(['vista-estado-viaje'], navigationExtras);
  }

  onLogout() {
    this.authService.logout();
  }
}

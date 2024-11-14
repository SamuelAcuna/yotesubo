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
  }

  ver(id: string) {
    const navigationExtras: NavigationExtras = {
      state: {
        id: id
      }
    };
    this.router.navigate(['vista-estado-viaje'], navigationExtras);
  }

  filter() {
    this.viajesComoConductor = this.viajesComoConductor.filter(viaje => viaje.isActive);
    this.viajesComoPasajero = this.viajesComoPasajero.filter(viaje => viaje.isActive);
  }

  loadViajes() {
    // Intentar obtener los viajes desde Firebase
    this.firestoreService.getViajesComoConductor(this.usuarioActivoId).subscribe((viajesConductor) => {
      this.viajesComoConductor = viajesConductor;
      this.filter();
      console.log('Viajes como conductor:', this.viajesComoConductor);

      // Guardar en localStorage
      localStorage.setItem('viajesComoConductor', JSON.stringify(this.viajesComoConductor));
    }, (error) => {
      // Si falla, cargar desde localStorage
      const storedViajesConductor = localStorage.getItem('viajesComoConductor');
      if (storedViajesConductor) {
        this.viajesComoConductor = JSON.parse(storedViajesConductor);
        console.log('Viajes como conductor cargados desde localStorage:', this.viajesComoConductor);
      }
    });

    this.firestoreService.getViajesComoPasajero(this.usuarioActivoId).subscribe((viajesPasajero) => {
      this.viajesComoPasajero = viajesPasajero;
      this.filter();
      console.log('Viajes como pasajero:', this.viajesComoPasajero);

      // Guardar en localStorage
      localStorage.setItem('viajesComoPasajero', JSON.stringify(this.viajesComoPasajero));
    }, (error) => {
      // Si falla, cargar desde localStorage
      const storedViajesPasajero = localStorage.getItem('viajesComoPasajero');
      if (storedViajesPasajero) {
        this.viajesComoPasajero = JSON.parse(storedViajesPasajero);
        console.log('Viajes como pasajero cargados desde localStorage:', this.viajesComoPasajero);
      }
    });

    console.log('usuario activo:', this.usuarioActivoId);
  }

  onLogout() {
    this.authService.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-mis-viajes',
  templateUrl: './mis-viajes.page.html',
  styleUrls: ['./mis-viajes.page.scss'],
})
export class MisViajesPage implements OnInit {
  viajesComoConductor: Viaje[] = [];
  viajesComoPasajero: Viaje[] = [];
  usuarioActivoId: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    // Intentamos cargar los datos desde localStorage al iniciar
    this.loadViajesFromLocalStorage();
    
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.usuarioActivoId = userId;
        this.loadViajes();
      }
    });
  }

  // Cargar los viajes desde Firestore y guardar en localStorage
  loadViajes() {
    this.firestoreService.getViajesComoConductor(this.usuarioActivoId).subscribe((viajesConductor) => {
      this.viajesComoConductor = viajesConductor;
      localStorage.setItem('viajesComoConductor', JSON.stringify(this.viajesComoConductor));
      console.log('Viajes como conductor:', this.viajesComoConductor);
    });

    this.firestoreService.getViajesComoPasajero(this.usuarioActivoId).subscribe((viajesPasajero) => {
      this.viajesComoPasajero = viajesPasajero;
      localStorage.setItem('viajesComoPasajero', JSON.stringify(this.viajesComoPasajero));
      console.log('Viajes como pasajero:', this.viajesComoPasajero);
    });
  }

  // Cargar los viajes desde localStorage
  loadViajesFromLocalStorage() {
    const viajesConductor = localStorage.getItem('viajesComoConductor');
    const viajesPasajero = localStorage.getItem('viajesComoPasajero');
    
    if (viajesConductor) {
      this.viajesComoConductor = JSON.parse(viajesConductor);
    }
    
    if (viajesPasajero) {
      this.viajesComoPasajero = JSON.parse(viajesPasajero);
    }
    
    console.log('Datos cargados desde localStorage:', {
      viajesComoConductor: this.viajesComoConductor,
      viajesComoPasajero: this.viajesComoPasajero
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Disponible':
        return 'estado-disponible';
      case 'En curso':
        return 'estado-en-proceso';
      case 'Cancelado':
        return 'estado-cancelado';
      case 'Completado':
        return 'estado-completado';
      case 'Pendiente':
        return 'estado-pendiente';
      default:
        return 'estado-default';
    }
  }
}

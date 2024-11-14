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
  viajes: Viaje[] = [];
  viajesComoConductor: Viaje[] = [];
  viajesComoPasajero: Viaje[] = [];
  usuarioActivoId: string = '';

  constructor( private authService: AuthService, private firestoreService: FirestoreService) {}
  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.usuarioActivoId = userId;
        this.loadViajes();
      }
    });
    
  }


  loadViajes() {
    // Obtener los viajes donde el usuario es conductor
    this.firestoreService.getViajesComoConductor(this.usuarioActivoId).subscribe((viajesConductor) => {
      this.viajesComoConductor = viajesConductor;
      console.log('Viajes como conductor:', this.viajesComoConductor);
    });

    // Obtener los viajes donde el usuario es pasajero
    this.firestoreService.getViajesComoPasajero(this.usuarioActivoId).subscribe((viajesPasajero) => {
      this.viajesComoPasajero = viajesPasajero;
      console.log('Viajes como pasajero:', this.viajesComoPasajero);
      
    });
    
    
    console.log('usuario activo:', this.usuarioActivoId);
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


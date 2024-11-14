import { Component } from '@angular/core';
import { NavigationExtras, Route, Router } from '@angular/router';
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

  constructor( private authService: AuthService, private firestoreService: FirestoreService, private router: Router) {}
  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.usuarioActivoId = userId;
        this.loadViajes();
      }
    });
    
  }
  ver(id: string) {
    // Aquí pasamos el id a la otra página usando state
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
    // Obtener los viajes donde el usuario es conductor
    this.firestoreService.getViajesComoConductor(this.usuarioActivoId).subscribe((viajesConductor) => {
      this.viajesComoConductor = viajesConductor;
      this.filter();
      console.log('Viajes como conductor:', this.viajesComoConductor);
    });

    // Obtener los viajes donde el usuario es pasajero
    this.firestoreService.getViajesComoPasajero(this.usuarioActivoId).subscribe((viajesPasajero) => {
      this.viajesComoPasajero = viajesPasajero;
      this.filter();
      console.log('Viajes como pasajero:', this.viajesComoPasajero);
      
    });
    
    
    console.log('usuario activo:', this.usuarioActivoId);
  }
  onLogout() {
    this.authService.logout();// Llama al método de cerrar sesión
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Viaje } from 'src/app/interfaces/viajes';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-vista-detalle-viaje',
  templateUrl: './vista-detalle-viaje.page.html',
  styleUrls: ['./vista-detalle-viaje.page.scss'],
})
export class VistaDetalleViajePage implements OnInit {
  viaje: Viaje | null = null;
  fechaFormateada: string = '';
  

  constructor(private iab: InAppBrowser,
              private firestoreService: FirestoreService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadViaje(id);
      
    }
    
  }
  
  
  loadViaje(id: string) {
    this.firestoreService.getViajeById(id).subscribe((data) => {
      this.viaje = data;
      console.log('Viaje:', this.viaje?.fecha);
      
      if (this.viaje?.fecha) {
        this.fechaFormateada = this.convertirFechaFormatoPersonalizado(this.viaje.fecha);
      }
      
    });
  }
  
  openWhatsApp() {
    const phoneNumber = '5696333333'; 
    const url = `https://wa.me/${phoneNumber}`;
  
    const browser = this.iab.create(url, '_system');
  
  
  }
  openCallApp() {
    const phoneNumber = '123456789'; // Reemplaza con el número de teléfono
    window.open(`tel:${phoneNumber}`, '_system');
  }
  convertirFechaFormatoPersonalizado(fechaString: string): string {
    // Crear un objeto Date a partir del string ISO
    const fecha = new Date(fechaString);
  
    // Opciones para formatear la fecha
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',   // Nombre del día de la semana (ej. Lunes)
      day: 'numeric',    // Día del mes (ej. 15)
      month: 'long',     // Nombre del mes (ej. noviembre)
      year: 'numeric'    // Año (ej. 2024)
    };
  
    // Convertir la fecha a formato deseado
    return fecha.toLocaleDateString('es-ES', opciones);
  }
}

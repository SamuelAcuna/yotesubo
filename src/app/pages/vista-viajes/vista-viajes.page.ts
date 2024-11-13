import { Component, OnInit } from '@angular/core';
import { Viaje } from 'src/app/interfaces/viajes'; // Asumiendo que tienes una interfaz Viaje
import { FirestoreService } from 'src/app/services/firestore.service'; // Servicio para obtener los viajes

@Component({
  selector: 'app-vista-viajes',
  templateUrl: './vista-viajes.page.html',
  styleUrls: ['./vista-viajes.page.scss'],
})
export class VistaViajesPage implements OnInit {
  viajes: Viaje[] = [];  // Lista de viajes filtrados
  viajesOriginales: Viaje[] = [];  // Lista de viajes sin filtrar
  comunaSeleccionada: string = '';  // Variable para almacenar la comuna seleccionada

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit() {
    this.loadViajes();  // Cargar todos los viajes al inicio
  }

  // Cargar los viajes desde el servicio (ejemplo con Firestore)
  loadViajes() {
    this.firestoreService.getViajes().subscribe((viajes) => {
      this.viajesOriginales = viajes;  // Guardar todos los viajes sin filtrar
      this.viajes = viajes;  // Inicialmente mostramos todos los viajes
    });
  }

  // Filtrar los viajes según la comuna seleccionada
  filtrarPorComuna() {
    if (this.comunaSeleccionada) {
      // Filtrar los viajes basados en la comuna seleccionada
      this.viajes = this.viajesOriginales.filter(viaje => viaje.comuna === this.comunaSeleccionada);
    } else {
      // Si no se ha seleccionado ninguna comuna, mostrar todos los viajes
      this.viajes = this.viajesOriginales;
    }
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalleviaje-conductor',
  templateUrl: './detalleviaje-conductor.page.html',
  styleUrls: ['./detalleviaje-conductor.page.scss'],
})
export class DetalleviajeConductorPage implements OnInit {
  viaje: any; // Aquí puedes usar el tipo adecuado, dependiendo de cómo esté estructurado tu objeto 'nuevoViaje'

  ngOnInit() {
    // Obtener los datos del viaje desde el estado del router
    const navigation = history.state;
    if (navigation && navigation.viaje) {
      this.viaje = navigation.viaje;
      console.log('Datos del viaje:', this.viaje);
    } else {
      console.error('No se han recibido datos del viaje.');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { User } from 'src/app/interfaces/user';
import { EstadoViaje, Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-vistaconductor',
  templateUrl: './vistaconductor.page.html',
  styleUrls: ['./vistaconductor.page.scss'],
})
export class VistaconductorPage implements OnInit {
  viaje: Viaje | null = null;
  fechaFormateada: string = '';
  user: User | null = null;
  userID: string = '';
  conductor: User | null = null;

  constructor(private iab: InAppBrowser,
              private firestoreService: FirestoreService,
              private route: ActivatedRoute,
              private authService: AuthService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadViaje(id);
    }
    this.authService.getCurrentUserId().subscribe((userID) => {
      if (userID) {
        this.userID = userID;
        console.log('User ID:', this.userID); // Verifica el userID aquí
        this.loadUsers(); // Llamar al método para cargar todos los usuarios
      } else {
        console.log('No se encontró un usuario autenticado');
      }
    });
    
  }
  loadConductor(userId: string) {
    this.firestoreService.getAllUsers().subscribe((usersData) => {
      const foundUser = usersData.find(user => user.uid === userId); // Usa el parámetro userId
      if (foundUser) {
        this.conductor = foundUser; // Asigna el usuario encontrado
        console.log('Conductor encontrado:', this.conductor);
      } else {
        console.log('No se encontró el usuario con el UID proporcionado');
      }
    });
  }
  cambiarEstado(estado: string) {
    
    if (this.viaje && this.viaje.id) {
      if(estado === 'En curso'){
        this.viaje.estado = EstadoViaje.EnCurso;
      }else if(estado === 'Cancelado'){
        this.viaje.estado = EstadoViaje.Cancelado;
        this.viaje.isActive = false;
      }else if(estado === 'Completado'){
        this.viaje.estado = EstadoViaje.Completado;
        this.viaje.isActive = false;
      }
      this.firestoreService.updateDocument('viajes', this.viaje.id, { 
        estado: this.viaje.estado,
        isActive: this.viaje.isActive
      })  
    }
  }
  //Consulta de datos
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
  loadViaje(id: string) {
    this.firestoreService.getViajeById(id).subscribe((data) => {
      this.viaje = data;
      console.log('Viaje:', this.viaje);
      console.log(this.viaje?.userId);
      if (this.viaje?.userId) {
        this.loadConductor(this.viaje.userId);
      }else{
        console.log('No se encontró el ID del conductor')
      }
      if (this.viaje?.fecha) {
        this.fechaFormateada = this.convertirFechaFormatoPersonalizado(this.viaje.fecha);
      }
    });
    
  }
  

  //Servicios extras
  openWhatsApp(phonenumber: string) {
    const url = `https://wa.me/${phonenumber}`;
    const browser = this.iab.create(url, '_system');
  }
  
  openCallApp(phonenumber: string) {
    window.open(`tel:${phonenumber}`, '_system');
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

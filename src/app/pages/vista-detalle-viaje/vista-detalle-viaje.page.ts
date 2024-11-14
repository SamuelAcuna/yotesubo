import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { User } from 'src/app/interfaces/user';
import { Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { EstadoViaje } from '../../interfaces/viajes';
import { ToastController } from '@ionic/angular';
import { EmailService } from 'src/app/services/email.service';


@Component({
  selector: 'app-vista-detalle-viaje',
  templateUrl: './vista-detalle-viaje.page.html',
  styleUrls: ['./vista-detalle-viaje.page.scss'],
})
export class VistaDetalleViajePage implements OnInit {
  viaje: Viaje | null = null;
  fechaFormateada: string = '';
  user: User | null = null;
  userID: string = '';
  conductor: User | null = null;

  constructor(private iab: InAppBrowser,
              private firestoreService: FirestoreService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private toastController: ToastController,
              private emailService: EmailService) { }

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


  // Petición de viaje
  pedirViaje() {
    if (this.viaje && this.user) {
      // Verificar si ya hay asientos disponibles
      if (this.viaje.asientosDisponibles <= 0) {
        console.log('No hay asientos disponibles para este viaje');
        this.showToast('No hay asientos disponibles para este viaje');
        return;  // Salir si no hay asientos disponibles
      }
  
      // Verificar si el usuario ya está en la lista de pasajeros
      const pasajeroEncontrado = this.viaje.pasajeros.find(pasajero => pasajero.uid === this.user?.uid);
  
      if (pasajeroEncontrado) {
        console.log('Ya estás en la lista de pasajeros');
        this.showToast('Ya estás en la lista de pasajeros');
        return;  // Salir si el usuario ya está en la lista
      }
  
      // Agregar al usuario actual a la lista de pasajeros
      this.viaje.pasajeros.push({
        uid: this.user.uid,
        nombreCompleto: this.user.nombreCompleto,
        celular: this.user.celular,
        email: this.user.email  // Incluye otros campos de User si es necesario
      });
  
      // Disminuir la cantidad de asientos disponibles
      this.viaje.asientosDisponibles--;
  
      // Actualizar el documento de viaje con la nueva lista de pasajeros y la cantidad de asientos disponibles
      if (this.viaje && this.viaje.id) {
        if (this.viaje.asientosDisponibles === 0) {
          this.viaje.estado = EstadoViaje.Pendiente;
        }
        this.firestoreService.updateDocument('viajes', this.viaje.id, { 
          pasajeros: this.viaje.pasajeros,
          asientosDisponibles: this.viaje.asientosDisponibles,
          estado: this.viaje.estado
        })
        .then(() => {
          console.log('Viaje actualizado con nuevo pasajero');
          this.showToast('Viaje solicitado con éxito');
          this.emailService.sendEmail(this.user?.nombreCompleto || '', this.conductor?.email || '',this.conductor?.nombreCompleto || '','He reservado una plaza en tu viaje');
        })
        .catch((error) => console.error('Error al actualizar el viaje:', error));
      } else {
        console.error('El ID del viaje no está definido');
      }
    }
  }
  email(){
    this.emailService.sendEmail(this.user?.nombreCompleto || '', this.conductor?.email || '',this.conductor?.nombreCompleto || '','He reservado una plaza en tu viaje');
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
  

  // Servicios extras
  openWhatsApp(phonenumber: string) {
    const url = `https://wa.me/${phonenumber}`;
    const browser = this.iab.create(url, '_system');
    this.showToast('Abriendo WhatsApp...');
  }
  
  openCallApp(phonenumber: string) {
    window.open(`tel:${phonenumber}`, '_system');
    this.showToast('Abriendo la aplicación de teléfono...');
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
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}

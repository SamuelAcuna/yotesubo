import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { EstadoViaje, Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { EmailService } from 'src/app/services/email.service';


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
              private navCtrl: NavController,
              private firestoreService: FirestoreService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private toastController: ToastController,
              private email: EmailService) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadViaje(id);
    }
    this.authService.getCurrentUserId().subscribe((userID) => {
      if (userID) {
        this.userID = userID;
        console.log('User ID:', this.userID);
        this.loadUsers();
      } else {
        console.log('No se encontró un usuario autenticado');
      }
    });
  }

  // Método para cargar el viaje y, si no hay datos en Firebase, usar los de localStorage
  loadViaje(id: string) {
    this.firestoreService.getViajeById(id).subscribe((data) => {
      if (data) {
        this.viaje = data;
        console.log('Viaje encontrado:', this.viaje);
        this.saveToLocalStorage('viaje', this.viaje); // Guardar los datos de Firebase en localStorage
        if (this.viaje.userId) {
          this.loadConductor(this.viaje.userId);
        } else {
          console.log('No se encontró el ID del conductor');
        }
        if (this.viaje.fecha) {
          this.fechaFormateada = this.convertirFechaFormatoPersonalizado(this.viaje.fecha);
        }
      } else {
        console.log('No se encontró el viaje en Firebase, cargando desde localStorage');
        const storedViaje = this.loadFromLocalStorage<Viaje>('viaje');
        if (storedViaje) {
          this.viaje = storedViaje;
          console.log('Viaje cargado desde localStorage:', this.viaje);
          this.fechaFormateada = this.convertirFechaFormatoPersonalizado(this.viaje.fecha);
        }
      }
    });
  }

  // Método para cargar los datos del conductor
  loadConductor(userId: string) {
    this.firestoreService.getAllUsers().subscribe((usersData) => {
      const foundUser = usersData.find(user => user.uid === userId);
      if (foundUser) {
        this.conductor = foundUser;
        this.saveToLocalStorage('conductor', this.conductor); // Guardar el conductor en localStorage
        console.log('Conductor encontrado:', this.conductor);
      } else {
        console.log('No se encontró el usuario con el UID proporcionado');
      }
    });
  }

  // Método para cargar todos los usuarios
  loadUsers() {
    console.log('Buscando todos los usuarios...');
    this.firestoreService.getAllUsers().subscribe((usersData) => {
      const foundUser = usersData.find(user => user.uid === this.userID);
      if (foundUser) {
        this.user = foundUser;
        this.saveToLocalStorage('user', this.user); // Guardar el usuario en localStorage
        console.log('Usuario personalizado encontrado:', this.user);
      } else {
        console.log('No se encontró el usuario con el UID proporcionado');
      }
    });
  }

  // Guardar en localStorage
  saveToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Cargar desde localStorage
  loadFromLocalStorage<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }

  // Cambiar estado del viaje
  cambiarEstado(estado: string) {
    if (this.viaje && this.viaje.id) {
      if(estado === 'En curso'){
        this.viaje.estado = EstadoViaje.EnCurso;
        this.showToast('Viaje Iniciado');
      }else if(estado === 'Cancelado'){
        this.viaje.estado = EstadoViaje.Cancelado;
        this.viaje.isActive = false;
        this.showToast('Viaje cancelado');
        this.navCtrl.navigateBack('/home'); 
      }else if(estado === 'Completado'){
        this.viaje.estado = EstadoViaje.Completado;
        this.viaje.isActive = false;
        this.showToast('Viaje completado');
        this.navCtrl.navigateBack('/home');
      }
      if (this.viaje.pasajeros && this.viaje.pasajeros.length > 0) {
        this.viaje.pasajeros.forEach((pasajero) => {
          if (pasajero.email) {
            const fromName = this.conductor ? this.conductor.nombreCompleto : 'Conductor';
            const fromEmail = pasajero ? pasajero.email : '';
            const toName = pasajero.nombreCompleto;
            const message = `Estimado/a ${toName}, su viaje con estado ${estado} ha sido actualizado.`;
            
            this.email.sendEmailreserva(fromName, fromEmail, toName, message, estado);
          }
        });
      }
      this.firestoreService.updateDocument('viajes', this.viaje.id, { 
        estado: this.viaje.estado,
        isActive: this.viaje.isActive
      });
      this.saveToLocalStorage('viaje', this.viaje); // Actualizar en localStorage
    }
  }

  // Servicios extras
  openWhatsApp(phonenumber: string) {
    const url = `https://wa.me/${phonenumber}`;
    this.iab.create(url, '_system');
  }

  openCallApp(phonenumber: string) {
    window.open(`tel:${phonenumber}`, '_system');
  }

  // Convertir fecha a formato personalizado
  convertirFechaFormatoPersonalizado(fechaString: string): string {
    const fecha = new Date(fechaString);
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
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

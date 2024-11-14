import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Cargar email y contraseña directamente desde localStorage
    const savedEmail = localStorage.getItem('lastUserEmail');
    const savedPassword = localStorage.getItem('lastUserPassword');

    if (savedEmail && savedPassword) {
      this.email = savedEmail;
      this.password = savedPassword;
      this.autoLogin();
    }
  }

  // Función para el inicio de sesión manual
  onLogin() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        this.showToast('Inicio de sesión exitoso');
        // Guardar el email y la contraseña en localStorage
        localStorage.setItem('lastUserEmail', this.email);
        localStorage.setItem('lastUserPassword', this.password);
        this.navCtrl.navigateForward('/home');
      })
      .catch((error) => {
        this.showToast(`Error al iniciar sesión: ${error.message}`);
      });
  }

  // Intentar iniciar sesión automáticamente
  autoLogin() {
    // Si Firebase no está disponible, usar autenticación local
    if (!navigator.onLine) {
      this.showToast('Conexión no disponible, usando autenticación local');
      this.navCtrl.navigateForward('/home');
    } else {
      // Verificar con Firebase si hay conexión
      this.afAuth.signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          this.showToast('Reconexión automática exitosa');
          this.navCtrl.navigateForward('/home');
        })
        .catch(() => {
          this.showToast('Por favor, verifica tu conexión o introduce tu contraseña');
        });
    }
  }

  // Mostrar mensaje de confirmación
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}

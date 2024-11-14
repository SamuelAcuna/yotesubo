import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
@Component({
  selector: 'app-restablecerpass',
  templateUrl: './restablecerpass.page.html',
  styleUrls: ['./restablecerpass.page.scss'],
})
export class RestablecerpassPage {
  email: string = '';

  constructor(private afAuth: AngularFireAuth,
              private navCtrl: NavController, 
              private alertController: AlertController, 
              private toastController: ToastController) {}

  async onSendCode() {
    if (this.email) {
      // Crea la alerta
      const alert = await this.alertController.create({
        header: 'Enlace Enviado',
        message: `Se ha enviado un enlace de recuperacion a ${this.email}`,
        buttons: [{
          text: 'OK',
          handler: () => {
            // Redirige a la página de ingreso de código
            this.afAuth.sendPasswordResetEmail(this.email)
              .then(() => {
                this.showToast('Se ha enviado un enlace para restablecer tu contraseña');
                this.navCtrl.navigateBack('/login');
              })
              .catch((error) => {
                this.showToast(`Error al enviar el enlace de recuperación: ${error.message}`);
              });
          }
        }]
      });
      await alert.present();
    } else {
      // Muestra alerta si el correo está vacío
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, ingrese un correo válido.',
        buttons: ['OK']
      });
      await alert.present();
    }
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

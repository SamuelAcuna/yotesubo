import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string= '';
  
  constructor(private afAuth: AngularFireAuth, 
              private toastController: ToastController,
              private navCtrl: NavController,) {}

 
  onLogin() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        this.showToast('Inicio de sesion exitoso');
        this.navCtrl.navigateForward('/home');
      }).catch((error) => {
        this.showToast(`Error al iniciar sesion {{error}}`);
      });
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

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NavController, ToastController } from '@ionic/angular';
import { FirebaseError } from '@angular/fire/app';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
})
export class RegistroUsuarioPage implements OnInit {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombre: string = '';
  celular: string = '';

  constructor(
    private afAuth: AngularFireAuth,
    private navCtrl: NavController,
    private toastController: ToastController,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {}
    
  async registerUser() {
    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      return;
    }

    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      const user = userCredential.user;
      const usuario = {
        uid: user?.uid,
        email: this.email,
        nombreCompleto: this.nombre,  // Puedes solicitar más datos en el registro si necesitas más información
        celular: this.celular,
      };

      if (user) {
        await user.sendEmailVerification();
        this.firestoreService.addDocument('user', usuario)
        .then(() => {
          console.log('user saved successfully!');
        })
        .catch((error) => {
          console.error('Error saving user:', error);
        });
        this.showToast('Registro exitoso! Por favor, revisa tu correo para verificar la cuenta.');
      }
      this.navCtrl.navigateForward('/home');
    } catch (error: unknown) {  // Cambiamos el tipo de 'error' a 'unknown'
      if (error instanceof FirebaseError) {
        this.showToast('Error al registrar: ' + error.message);
      } else {
        this.showToast('Ocurrió un error inesperado.');
      }
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
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Car } from 'src/app/interfaces/cars';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-autp',
  templateUrl: './crear-autp.page.html',
  styleUrls: ['./crear-autp.page.scss'],
})
export class CrearAutpPage implements OnInit {

  carForm: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private firestoreService: FirestoreService, 
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController) {
      this.carForm = this.fb.group({
        userId: ['', Validators.required],
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        anio: [2020, [Validators.required, Validators.min(1900)]],
        capacidad: [4, [Validators.required, Validators.min(1)]],
        color: ['', Validators.required],
        patente: ['', Validators.required],
        imagen: [''],
    });
  }

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.carForm.patchValue({ userId: userId });
      }
    });
  }
  saveCar() {
    if (this.carForm.valid) {
      const carData: Car = this.carForm.value;
      console.log('Car data:', carData);
      this.firestoreService.addDocument('cars', carData)
        .then(() => {
          console.log('Car saved successfully!');

          this.showToast('Auto guardado correctamente');  
          this.carForm.reset(); // Resetea el formulario tras guardar
          this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
        })
        .catch((error) => {
          console.error('Error saving car:', error);
          this.showToast('Hubo un error al guardar el auto');
        });
      } else {
        console.log('Car data:', this.carForm.value);
        console.log('Formulario inválido');
        this.showToast('Por favor completa el formulario');
      }
  }



  


  


  incrementSeats() {
    const currentValue = this.carForm.get('capacidad')?.value;
    if (currentValue < 4) { // Límite máximo
      this.carForm.get('capacidad')?.setValue(currentValue + 1);
    }
  }
  
  decrementSeats() {
    const currentValue = this.carForm.get('capacidad')?.value;
    if (currentValue > 1) { // Límite mínimo
      this.carForm.get('capacidad')?.setValue(currentValue - 1);
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

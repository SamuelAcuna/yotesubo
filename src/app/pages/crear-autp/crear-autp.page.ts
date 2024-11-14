import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Car } from 'src/app/interfaces/cars';
import { FirestoreService } from 'src/app/services/firestore.service';

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
    private router: Router) {
      this.carForm = this.fb.group({
        userId: ['', Validators.required],
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        anio: [0, [Validators.required, Validators.min(1900)]],
        capacidad: [0, [Validators.required, Validators.min(1)]],
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
          this.carForm.reset(); // Resetea el formulario tras guardar
          this.router.navigate(['/home']); // Redirige al usuario a la página de inicio
        })
        .catch((error) => {
          console.error('Error saving car:', error);
        });
      } else {
        console.log('Car data:', this.carForm.value);
        console.log('Formulario inválido');
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
}

import { FirestoreService } from './../../services/firestore.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Car } from 'src/app/interfaces/cars';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css']
})
export class CarsComponent implements OnInit {
  cars$: Observable<Car[]> | undefined;

  constructor(private firestoreService: FirestoreService) {}

  ngOnInit(): void {
    // Obtener todos los autos de la colección 'cars'
    this.cars$ = this.firestoreService.getCollection('cars');
  }
}

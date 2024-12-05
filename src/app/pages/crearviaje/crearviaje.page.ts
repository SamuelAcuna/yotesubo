import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Car } from 'src/app/interfaces/cars';
import { EstadoViaje, Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { LocaldbService } from 'src/app/services/localdb.service';

@Component({
  selector: 'app-crearviaje',
  templateUrl: './crearviaje.page.html',
  styleUrls: ['./crearviaje.page.scss'],
})
export class CrearviajePage implements OnInit {
  currentStep: number = 1; // Estado inicial, paso 1
  maxSteps: number = 3; // Número total de pasos
  today: string;
  userID: string = '';
  cars: Car[] = [];
  comuna: string = '';
  fecha: string = '';
  carId: string = '';
  asientosDisponibles: number = 1;
  precio: number = 500;
  descripcion: string = '';
  selectedCar: Car | null = null;
  address: string = '';
  suggestions: string[] = [];
  mapImageUrl: string = '';
  capacidad: number = 1;
  defaultMapImageUrl: string = 'https://image.maps.ls.hereapi.com/mia/1.6/mapview?apiKey=GU-ZunxP3j79NsKTv9771VUPUFCcttuZZypuvvZlIWE&c=-36.79584,-73.06118&z=14&w=600&h=400&t=0';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient,
    private localdbService: LocaldbService
  ) {
    const now = new Date();
    this.today = now.toISOString();
    this.fecha = this.today;
    this.mapImageUrl = this.defaultMapImageUrl;
  }

  ngOnInit() {
    this.authService.getCurrentUserId().subscribe((userId) => {
      if (userId) {
        this.userID = userId;
        this.loadUserCars(userId);
      }
    });
  }

  loadUserCars(userId: string) {
    this.firestoreService.getCarsByUserId(userId).subscribe((cars) => {
      this.cars = cars;
      
    });
  }

  customCounterFormatter(inputLength: number, maxLength: number): string {
    return `${maxLength - inputLength} characters remaining`;
  }

  incrementSeats() {
    if (this.asientosDisponibles < this.capacidad) {
      this.asientosDisponibles++;
    }
    else {
      this.showToast('La cantidad de asientos no puede ser mayor a la capacidad del auto');
    }
  }

  decrementSeats() {
    if (this.asientosDisponibles > 1) {
      this.asientosDisponibles--;
    }
  }

  searchAddress(address: string) {
    const apiKey = 'GU-ZunxP3j79NsKTv9771VUPUFCcttuZZypuvvZlIWE';
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    this.http.get(url).subscribe((response: any) => {
      if (response.items && response.items.length > 0) {
        this.suggestions = response.items.map((item: any) => this.formatAddress(item.address));
      } else {
        this.suggestions = [];
      }
    });
  }

  formatAddress(address: any): string {
    let formatted = '';
    if (address.street) formatted += address.street;
    if (address.houseNumber) formatted += ` ${address.houseNumber}`;
    if (address.postalCode) formatted += `, ${address.postalCode}`;
    if (address.city) formatted += ` ${address.city}`;
    if (address.county) formatted += `, ${address.county}`;
    if (address.state) formatted += `, ${address.state}`;
    if (address.countryName) formatted += `, ${address.countryName}`;
    return formatted;
  }

  extractCityFromAddress(address: string): string {
    // Expresión regular para encontrar el código postal y la comuna siguiente
    const postalCodePattern = /\b\d{7}\s+([^\.,]+)/; // Busca 7 dígitos seguidos de un espacio y captura el siguiente texto
    
    // Ejecuta la expresión regular en la dirección
    const match = address.match(postalCodePattern);
  
    // Retorna la comuna capturada o un valor predeterminado
    return match ? match[1].trim() : 'Desconocido';
  }

  selectSuggestion(suggestion: string) {
    this.address = suggestion;
    this.suggestions = [];
    this.comuna = this.extractCityFromAddress(suggestion);
    this.getCoordinatesFromAddress(suggestion);
  }

  getCoordinatesFromAddress(address: string) {
    const apiKey = 'GU-ZunxP3j79NsKTv9771VUPUFCcttuZZypuvvZlIWE';
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(address)}&apiKey=${apiKey}`;

    this.http.get(url).subscribe(
      (response: any) => {
        if (response.items && response.items.length > 0) {
          const location = response.items[0].position;
          this.generateStaticMap(location.lat, location.lng);
        }
      },
      (error) => {
        console.error('Error al obtener las coordenadas:', error);
      }
    );
  }

  generateStaticMap(lat: number, lng: number) {
    const apiKey = 'GU-ZunxP3j79NsKTv9771VUPUFCcttuZZypuvvZlIWE';
    this.mapImageUrl = `https://image.maps.ls.hereapi.com/mia/1.6/route?apiKey=${apiKey}&r=-36.79584,-73.06118,${lat},${lng}&w=600&h=400&t=0`;
  }

  async saveMapImage(mapUrl: string) {
    try {
      await this.localdbService.saveImage('mapImage', mapUrl);
    } catch (error) {
      console.error('Error al guardar la imagen:', error);
    }
  }

  async createTrip(form: any) {
    if (form.valid) {
      const nuevoViaje: Viaje = {
        userId: this.userID,
        comuna: this.comuna,
        destino: this.address,
        fecha: this.fecha.toString(),
        hora: this.fecha.split('T')[1],
        asientosTotales: this.asientosDisponibles,
        asientosDisponibles: this.asientosDisponibles,
        precio: this.precio,
        carId: this.carId,
        imagen: `assets/img/${this.comuna}.jpg`,
        pasajeros: [],
        estado: EstadoViaje.Disponible,
        descripcion: this.descripcion,
        isActive: true,
      };

      try {
        await this.firestoreService.addDocument('viajes', nuevoViaje);
        this.showToast('Viaje creado exitosamente');
        this.router.navigate(['/detalleviaje-conductor'], { state: { viaje: nuevoViaje } });
      } catch (error) {
        console.error('Error al crear el viaje:', error);
      }
    } else {
      this.showToast('Por favor complete todos los campos requeridos.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
  
  nextStep() {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
    }
  }

  // Función para retroceder de paso
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  canProceedToNextStep(): boolean {
    if (this.currentStep === 1 && !this.address) {
      return false;
    }
    if (this.currentStep === 2 && !this.fecha) {
      return false;
    }
    return true;
  }
  onCarChange() {
    console.log('Auto seleccionado:', this.selectedCar);
    this.capacidad = this.selectedCar?.capacidad || 1;
    this.carId = this.selectedCar?.id || '';
    console.log('Asientos disponibles:', this.capacidad);
    this.asientosDisponibles = this.capacidad;
  }
}

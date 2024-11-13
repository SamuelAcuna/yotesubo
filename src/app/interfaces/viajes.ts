import { User } from "./user";

export interface Viaje {
  id?: string; // ID único asignado por Firestore (opcional)
  userId: string; // ID del conductor o propietario del viaje
  comuna: string; // Comuna destino
  destino: string; // Ubicación de destino
  fecha: string; // Fecha del viaje
  hora: string; // Hora de salida
  asientosTotales: number; // Número total de asientos disponibles
  asientosDisponibles: number; // Número de asientos disponibles para reserva
  precio: number; // Precio por asiento o viaje
  carId: string; // ID o descripción del vehículo usado
  imagen: string; // URL de la imagen del viaje o vehículo
  pasajeros: User[]; // Lista de usuarios reservados como pasajeros
  estado: EstadoViaje; // Estado actual del viaje (tipo enum)
  descripcion: string; // Descripción del viaje
  isActive: boolean; // Indica si el viaje está activo o visible para los usuarios
}

// Enum para los estados del viaje
export enum EstadoViaje {
  Pendiente = "Pendiente",
  Disponible = "Disponible",
  EnCurso = "En curso",
  Completado = "Completado",
  Cancelado = "Cancelado"
}

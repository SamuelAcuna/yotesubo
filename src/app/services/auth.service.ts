import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  // Función para cerrar sesión
  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/login']); // Redirige al usuario a la página de login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  getCurrentUserId(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map((user) => user ? user.uid : null)
    );
  }
}

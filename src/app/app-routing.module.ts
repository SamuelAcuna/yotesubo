import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  {
    path: 'restablecerpass',
    loadChildren: () => import('./pages/restablecerpass/restablecerpass.module').then( m => m.RestablecerpassPageModule)
  },
  {
    path: 'ingreso-codigo',
    loadChildren: () => import('./pages/ingreso-codigo/ingreso-codigo.module').then( m => m.IngresoCodigoPageModule)
  },
  {
    path: 'cambio-pass',
    loadChildren: () => import('./pages/cambio-pass/cambio-pass.module').then( m => m.CambioPassPageModule)
  },
  {
    path: 'vista-viajes',
    loadChildren: () => import('./pages/vista-viajes/vista-viajes.module').then( m => m.VistaViajesPageModule)
  },
  {
    path: 'vista-detalle-viaje',
    loadChildren: () => import('./pages/vista-detalle-viaje/vista-detalle-viaje.module').then( m => m.VistaDetalleViajePageModule)
  },
  {
    path: 'vista-estado-viaje',
    loadChildren: () => import('./pages/vista-estado-viaje/vista-estado-viaje.module').then( m => m.VistaEstadoViajePageModule)
  },
  {
    path: 'crearviaje',
    loadChildren: () => import('./pages/crearviaje/crearviaje.module').then( m => m.CrearviajePageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'crear-autp',
    loadChildren: () => import('./pages/crear-autp/crear-autp.module').then( m => m.CrearAutpPageModule)
  },
  {
    path: 'mis-viajes',
    loadChildren: () => import('./pages/mis-viajes/mis-viajes.module').then( m => m.MisViajesPageModule)
  },


];



@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

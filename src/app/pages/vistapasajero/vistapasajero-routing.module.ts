import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistapasajeroPage } from './vistapasajero.page';

const routes: Routes = [
  {
    path: '',
    component: VistapasajeroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistapasajeroPageRoutingModule {}

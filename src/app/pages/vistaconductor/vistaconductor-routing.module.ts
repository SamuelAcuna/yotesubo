import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaconductorPage } from './vistaconductor.page';

const routes: Routes = [
  {
    path: '',
    component: VistaconductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaconductorPageRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearAutpPageRoutingModule } from './crear-autp-routing.module';

import { CrearAutpPage } from './crear-autp.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    CrearAutpPageRoutingModule
  ],
  declarations: [CrearAutpPage]
})
export class CrearAutpPageModule {}

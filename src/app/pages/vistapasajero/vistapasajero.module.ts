import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistapasajeroPageRoutingModule } from './vistapasajero-routing.module';

import { VistapasajeroPage } from './vistapasajero.page';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistapasajeroPageRoutingModule
  ],
  declarations: [VistapasajeroPage],
  providers: [InAppBrowser] 
})
export class VistapasajeroPageModule {}

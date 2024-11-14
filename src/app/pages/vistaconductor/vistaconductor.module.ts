import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaconductorPageRoutingModule } from './vistaconductor-routing.module';

import { VistaconductorPage } from './vistaconductor.page';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaconductorPageRoutingModule
  ],
  declarations: [VistaconductorPage],
  providers: [InAppBrowser] 
})
export class VistaconductorPageModule {}

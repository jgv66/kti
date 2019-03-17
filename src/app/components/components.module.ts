/*  para crear un modulo que sirva como componente compartido
ionic g module components
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GrillastockComponent } from './grillastock/grillastock.component';

@NgModule({
  declarations: [ GrillastockComponent],
  imports:      [ CommonModule, IonicModule ],
  exports:      [ GrillastockComponent]
})
export class ComponentsModule { }

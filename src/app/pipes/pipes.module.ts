import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HoragrabPipe } from './horagrab.pipe';
import { DestinoPipe } from './destino.pipe';

@NgModule({
    imports: [ CommonModule ],
    declarations: [ HoragrabPipe, DestinoPipe],
    exports: [ HoragrabPipe, DestinoPipe ]
})

export class PipesModule {}
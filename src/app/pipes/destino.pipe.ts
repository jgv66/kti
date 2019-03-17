import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'destino'
})
export class DestinoPipe implements PipeTransform {

  transform(value: any, args1: any): any {

    const patron    = '|';
    const separador = ',';

    return value.replace(patron, separador) ;
  }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horagrab'
})
export class HoragrabPipe implements PipeTransform {

  transform( valor: number ): any {

    const nHora    = Math.trunc( valor / 3600 );
    const nMinutos = Math.trunc(( valor - ( nHora * 3600 )) / 60 );

    return nHora.toString().trim() + ':' + nMinutos.toString().trim();
  }

}

import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from 'src/app/services/funciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {

  nombreEmpresa = '';
  usuario:      any;
  tareas: any[] = [];

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private router: Router ) {
  }

  ionViewWillEnter() {
  }

  ngOnInit() {
    this.datos.readDatoLocal( 'KTI_empresa' ).then( dato => this.nombreEmpresa = dato );
    this.datos.readDatoLocal( 'KTI_usuario')
        .then( dato => {  this.usuario = dato;
                          this.aBuscarTareas(); } );
  }

  aBuscarTareas() {
    console.log(this.usuario);
    this.datos.getSomeData( '/ktp_tareas',
                            { empresa: this.usuario.empresa,
                              usuario: this.usuario.usuario } )
        .subscribe( data => { this.revisaData( data ); },
                    err  => { this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }

  revisaData( data: any ) {
    const rs    = data.tareas;
    const largo = rs.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION', 'No existen tareas pendientes asignadas a este usuario. Intente en algun momento más adelante.');
    } else if ( largo > 0 ) {
      //
      console.log(rs);
      this.tareas = rs;
      //
    }
  }

  revisarTarea( idTarea ) {
    this.router.navigateByUrl(`/tabs/tabinicio/conteo/${ idTarea }` );
  }

}

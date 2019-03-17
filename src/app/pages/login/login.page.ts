import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  clave = '';
  empresa = '';
  emp = '';
  empresas = [];
  marcas = [];
  superfam = [];

  constructor(  private datos: DatosService,
                private router: Router ) { }

  ngOnInit() {
    this.datos.getDataEmpresas().subscribe( data => { this.empresas = data; } );
    this.datos.readDatoLocal( 'KTI_usuario' ).then( dato => { console.log(dato); });
  }

  login() {
    this.datos.getDataUser( 'proalma', this.email, this.clave, this.empresa )
      .subscribe( data => {
        const rs = data['recordsets'][0][0];
        if ( rs.usuario ) {
          //
          this.datos.saveDatoLocal( 'KTI_usuario', rs );
          this.empresas.forEach( element => {
            if ( element.empresa === this.empresa ) {
              this.datos.saveDatoLocal( 'KTI_empresa', element.razonsocial );
            }
          });
          this.router.navigate( ['/tabs'] );
        }
      },
      err => {
        console.error('ERROR Verifique credenciales', err);
      });
  }

  seleccionaEmpresa( event: any ) {
    this.emp = event;
    console.log(this.emp);
  }

}

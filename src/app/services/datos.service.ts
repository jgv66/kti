
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { tap, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  cualquierDato: any;
  loading: any;
  params: any;

  // puerto: SUSARON
  url    = 'https://api.kinetik.cl/susaron' ;
  puerto = '' ;

  constructor( private http: HttpClient,
               private loadingCtrl: LoadingController,
               private storage: Storage ) {
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
                      message: 'Rescatando',
                      duration: 7000
                    });
    return await this.loading.present();
  }

  /* FUNCIONES LOCALES */
  saveDatoLocal( token: any, dato: any ) {
    this.storage.set( token, JSON.stringify(dato) );
  }

  async readDatoLocal(token: any) {
    const dato = await this.storage.get(token);
    this.cualquierDato = !dato ? undefined : JSON.parse( dato );
    return this.cualquierDato;
  }

  deleteDatoLocal( token: any ) {
    this.storage.remove( token ).then( () => console.log( 'DatosService.deleteDatoLocal EXISTE y REMOVIDO->', token ) );
  }

  guardarStorage( data, lista ) {
    localStorage.setItem( data, JSON.stringify( lista ) );
  }

  async cargarStorage( data ) {
    if ( localStorage.getItem( data ) ) {
      return JSON.parse( localStorage.getItem( data ) );
    } else {
      return [];
    }
  }

  /* FUNCIONES REMOTAS */
  getDataEmpresas() {   /* debo cambiarlo por GET */
    return this.http.post( this.url + '' + this.puerto + '/ktp_empresas', { x: 1 } )
      .pipe( map( data => data['empresas'] ) );
  }

  getDataMarcas() {
    return this.http.get( this.url + '' + this.puerto + '/ktp_marcas_get' );
  }

  getDataSuperFamilias() {   /* debo cambiarlo por GET */
    return this.http.post( this.url + '' + this.puerto + '/ktp_superfamilias', { x: 1 } );
  }

  getDataUser( proceso: string, email: string, clave: string, empresa: string ) {
    this.showLoading();
    const datos = { rutocorreo: email, clave: clave, empresa: empresa };
    const body  = { sp: 'ksp_buscarUsuario', datos: datos };
    return this.http.post( this.url + '/' + proceso, body )
      .pipe( tap( value =>  { if ( this.loading ) { this.loading.dismiss(); } }) );
  }

  getSomeData( xsp: string, datos: any, mostrar?: boolean ) {
    console.log( xsp, datos );
    if ( mostrar ) { this.showLoading(); }
    const body = { datos };                     /* los datos pueden ir asi o con {}, se debe tener cuidado al leerlos */
    return this.http.post( this.url + xsp, body )
      .pipe( tap( value =>  { if ( this.loading && mostrar ) { this.loading.dismiss(); } }) );
  }

  saveSomeData( xsp: string, datos: any, mostrar?: boolean ) {
    console.log( xsp, datos );
    if ( mostrar ) { this.showLoading(); }
    const body = datos; /* los datos iran sin {} */
    return this.http.post( this.url + xsp, body )
      .pipe( tap( value =>  { if ( this.loading && mostrar ) { this.loading.dismiss(); } }) );
  }


}

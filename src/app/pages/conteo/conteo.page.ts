import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from 'src/app/services/funciones.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-conteo',
  templateUrl: './conteo.page.html',
  styleUrls: ['./conteo.page.scss'],
})
export class ConteoPage implements OnInit {

  idTarea:        any;
  itemesContados: any[] = [];
  itemesDeTarea:  any[] = [];
  usuario:        any;

  codigo:       string;
  bodega:       string;
  ud1:          boolean;
  ud2:          boolean;
  unidad_1:     string;
  unidad_2:     string;
  rtu:          number;
  cantidad1:    number;
  cantidad2:    number;
  descripcion:  string;
  validando:    boolean;

  listaCompletas: boolean;

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private activeRoute: ActivatedRoute,
               public alertCtrl: AlertController ) {
    this.idTarea = this.activeRoute.snapshot.paramMap.get( 'idTarea' );
    this.proximoItem();
  }

  ngOnInit() {
    //
    this.datos.readDatoLocal( 'KTI_usuario')
        .then( dato => {  this.usuario = dato;
                          this.BuscarLaTarea(); } );
    //
    this.datos.cargarStorage( 'conteo-' + this.idTarea )
        .then( data => {
          if ( data ) {
            this.itemesContados = data;
          } else {
            this.itemesContados = [];
          }
        } );
    //
    this.listaCompletas = false;
  }

  BuscarLaTarea() {
    this.datos.getSomeData( '/ktp_detalleTarea',
                            { empresa: this.usuario.empresa,
                              usuario: this.usuario.usuario,
                              idTarea: this.idTarea } )
    .subscribe( (data: any ) => { console.log( 'id', data.tareas); this.itemesDeTarea = data.tareas; },
                err          => { this.funciones.msgAlert( 'ATENCION', err );  } );
  }

  proximoItem() {
    this.codigo      = '';
    this.descripcion = '';
    this.bodega      = '';
    this.ud1         = true;
    this.ud2         = false;
    this.unidad_1    = '';
    this.unidad_2    = '';
    this.cantidad1   = 0;
    this.cantidad2   = 0;
    this.rtu         = 1;
    this.validando   = false;
  }

  cambiaUnidad( cambiar: number ) {
    if (  cambiar === 1 ) {
      this.ud1 = !this.ud2;
    } else {
      this.ud2 = !this.ud1;
    }
  }

  cambiaCantidad( cambiar: number ) {
    if (  cambiar === 1 ) {
      this.cantidad1 = this.cantidad2 * this.rtu;
    } else {
      this.cantidad2 = this.cantidad1 / this.rtu;
    }
  }

  ocultarLista() {
    this.listaCompletas = !this.listaCompletas;
  }

  agregarAConteo() {
    if ( this.codigo === '' ||  this.descripcion === '' ) {
      this.funciones.msgAlert( 'ATENCION', 'Código a guardar no debe estar vacío.' );
    } else if ( this.cantidad1 <= 0 || this.cantidad2 <= 0 ) {
      this.funciones.msgAlert( 'ATENCION', 'Nose aceptan cantidades en cero o negativas.' );
    } else {
      // si existe: lo descarto, lo sumo, lo cambio
      let existe = false;
      let nPos   = -1;
      this.itemesContados.forEach( element => {
        ++nPos;
        if ( element.codigo === this.codigo ) {
          existe = true;
        }
      });
      console.log(existe);
      if ( existe ) {
        this.preguntar( nPos );
      } else {
        this.add2List(false);
      }
    }
  }

  async preguntar( nPos ) {
    const alert = await this.alertCtrl.create( {
          header: 'ATENCION',
          subHeader: 'Código ya registrado',
          message: 'El código recien ingresado ya existe en la lista de códigos. Decida que hacer con este dato',
          buttons: [
            {
              text: 'Corregir',
              role: 'cancel',
              handler: () => {
                console.log('cancelar');
              }
            }, {
              text: 'Sumarlo',
              handler: () => {
                this.add2List(true, nPos );
              }
            }
          ]
      });
      alert.present();
  }

  add2List( sumar: boolean, nPos?: number ) {
    if ( sumar ) {
      this.itemesContados[nPos].fisico_ud1 += this.cantidad1;
      this.itemesContados[nPos].fisico_ud2 += this.cantidad2;
      this.funciones.muestraySale( 'Item fue sumado', 1 );
    } else {
      this.itemesContados.push( { id:           this.idTarea,
                                  codigo:       this.codigo,
                                  bodega:       this.bodega,
                                  descripcion:  this.descripcion,
                                  ud:           ( this.ud1 ? 1 : 2 ),
                                  unidad_ud1:   this.unidad_1,
                                  unidad_ud2:   this.unidad_2,
                                  fisico_ud1:   this.cantidad1,
                                  fisico_ud2:   this.cantidad2,
                                  rtu:          this.rtu } );
      this.funciones.muestraySale( 'Item agregado', 1 );
    }
    this.datos.guardarStorage( 'conteo-' + this.idTarea, this.itemesContados );
    this.proximoItem();
  }

  validarCodigo() {
    if ( this.codigo === '' ) {
      this.funciones.msgAlert( 'ATENCION', 'Código a validar no debe estar vacío' );
    } else {
      this.descripcion = '';
      this.itemesDeTarea.forEach( element => {
        if ( element.codigo === this.codigo ) {
          this.bodega       = element.bodega;
          this.descripcion  = element.descripcion;
          this.unidad_2     = element.unidad_2;
          this.unidad_1     = element.unidad_1;
          this.rtu          = element.rtu;
        }
      });
    }
  }

  async eliminarConteo() {
    const alert = await this.alertCtrl.create( {
      header: 'ATENCION',
      subHeader: 'ELIMINAR CONTEO',
      message: 'Esta acción elimina definitivamente del dispositivo el contenido del conteo ' +
               'de inventario para la tarea activa. Esta seguro de esta acción?',
      buttons: [
        {
          text: 'Eliminar',
          role: 'cancel',
          handler: () => {
            this.itemesContados = [];
            this.funciones.muestraySale( 'Lista de conteo eliminada', 1 );
            this.datos.guardarStorage( 'conteo-' + this.idTarea, this.itemesContados );
            this.proximoItem();
          }
        }, {
          text: 'NO !!',
          role: 'cancel',
          handler: () => {
            console.log('cancelar');
          }
        }
      ]
    });
    alert.present();
  }

  async finalizarConteo() {
    if ( this.itemesContados.length === 0 ) {
      this.funciones.msgAlert( '"ATENCION', 'La lista de conteo esta vacía.' )
    } else {
      const alert = await this.alertCtrl.create( {
        header: 'ATENCION',
        subHeader: 'Finalizar conteo físico',
        message: 'Estos datos serán enviados al servidor para procesar el conteo. ' +
                 'Luego de esta acción, el dispositivo eliminará el conteo. Esta seguro de esta acción?',
        buttons: [
          {
            text: 'Grabar',
            role: 'cancel',
            handler: () => { this.grabarConteo(); }
          }, {
            text: 'Continuar',
            role: 'cancel',
            handler: () => {}
          }
        ]
      });
      alert.present();
    }
  }

  grabarConteo() {
    this.datos.saveSomeData( '/ktp_grabaTarea',
                            { empresa: this.usuario.empresa,
                              usuario: this.usuario.usuario,
                              itemes:  this.itemesContados },
                            true )
        .subscribe( (data: any ) => { this.revisaGrabacion( data ); },
                    err          => { this.funciones.msgAlert( 'ATENCION', err );  } );
  }

  revisaGrabacion( data ) {
    if ( data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Los datos no han podido ser enviados, espere un momento y reintente.')
    } else {
      try {
        if ( data.resultado === 'ok' ) {
          this.itemesContados = [];
          this.datos.guardarStorage( 'conteo-' + this.idTarea, this.itemesContados );
          this.proximoItem();
          this.funciones.msgAlert( 'ATENCION', 'El conteo enviado ya ha llegado al servidor. Gracias por su ayuda.' );
        } else {
          console.log( 'errores de grabacion ', data )
        }
      } catch (e) {
        this.funciones.msgAlert('ATENCION', 'Ocurrió un error al intentar grabar el conteo ->' + e );
      }
    }
  }

  async scanBarcode() {
    try {
      await this.barcode.scan()
                .then( barcodeData => {
                      this.codigo = barcodeData.text.trim();
                      this.validarCodigo();
                }, (err) => {
                    // An error occurred
                });
    } catch(error) {
      console.error(error);
    }
  }

}
























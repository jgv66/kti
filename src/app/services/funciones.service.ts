import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DatosService } from './datos.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  loader:          any;
  loading:         any;
  usuario:         any;
  cliente:         any;
  varCliente:      any = [];
  config:          any;
  copiaPendientes: any;
  pendientes:      number;
  misCompras       = 0;
  documento:       any;

  constructor( private loadingCtrl: LoadingController,
               private alertCtrl:   AlertController,
               private datos:       DatosService,
               private toastCtrl:   ToastController ) {
  }

  textoSaludo() {
    const dia   = new Date();
    if ( dia.getHours() >= 8  && dia.getHours() < 12 ) {
      return 'buenos días ';
    } else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) {
      return 'buenas tardes ';
    } else {
      return 'buenas noches '; }
  }

  cargaEspera( milisegundos?) {
    this.loader = this.loadingCtrl.create({
      duration: ( milisegundos != null && milisegundos !== undefined ? milisegundos : 3000 )
      });
    this.loader.present();
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  async msgAlert( titulo, texto ) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      /*subHeader: 'Subtitle',*/
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestraySale( cTexto, segundos, posicion? ) {
    const toast = await this.toastCtrl.create({
      message: cTexto,
      animated: true,
      keyboardClose: true,
      duration: 1500 * segundos,
      position: posicion || 'middle'
    });
    toast.present();
  }

}

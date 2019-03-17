import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabsalida',
  templateUrl: './tabsalida.page.html',
  styleUrls: ['./tabsalida.page.scss'],
})
export class TabsalidaPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  salir(){
    this.router.navigate(['/home']);
  }

}

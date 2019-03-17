/*
ionic g component components/grillastock
*/
import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grillastock',
  templateUrl: './grillastock.component.html',
  styleUrls: ['./grillastock.component.scss']
})
export class GrillastockComponent implements OnInit {

  @Input() itemesContados;

  constructor( private datos: DatosService,
               private router: Router ) { }

  ngOnInit() {
  }

}

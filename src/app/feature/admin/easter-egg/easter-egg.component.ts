import { Component, OnInit } from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Router} from '@angular/router';

@Component({
  selector: 'app-easter-egg',
  templateUrl: './easter-egg.component.html',
  styleUrls: ['./easter-egg.component.scss']
})
export class EasterEggComponent implements OnInit {

  constructor(private logger: NGXLogger,
              private router: Router) { }

  ngOnInit(): void {
  }

}

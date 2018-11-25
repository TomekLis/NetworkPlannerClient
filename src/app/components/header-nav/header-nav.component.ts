import { Component, OnInit } from '@angular/core';
import { store } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logout() {
    localStorage.clear();
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  curUser: string;

  constructor() { }

  ngOnInit() {
    this.curUser = sessionStorage.getItem('currentUser') || 'Yuliya';
  }

}

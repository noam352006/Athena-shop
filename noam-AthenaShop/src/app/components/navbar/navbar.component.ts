import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service/login.service';
import { User } from 'src/app/shared/intrefaces/user';
import { AuthQuery } from 'src/app/shared/states/auth/auth.query';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  constructor(private authQuery: AuthQuery, private service: LoginService) {}

  connectedUser: User = this.authQuery.getCurrUser!;

  logOut(): void{
    this.service.logOut();
  }
}

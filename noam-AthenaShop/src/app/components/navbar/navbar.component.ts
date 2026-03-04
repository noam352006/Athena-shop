import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service/login.service';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';
import { User } from 'src/app/shared/intrefaces/user';
import { AuthQuery } from 'src/app/shared/states/auth/auth.query';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  constructor(private authQuery: AuthQuery, private service: LoginService) {}

  connectedUser: partialUser = this.authQuery.getCurrUser!;

  logOut(): void{
    this.service.logOut();
  }
}

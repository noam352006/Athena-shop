import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/states/auth/auth.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { partialUser } from 'src/app/shared/intrefaces/partialUser';
import { UserQueries } from '../apollo.service/queries/user.queries';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userQueries: UserQueries,
  ) {}

  async doesNameExists(name: string): Promise<boolean> {
    return (await this.userQueries.getUserByName(name)) ? true : false;
  }

  // get user from db with password and user name
  async getUserByCredentials(
    password: string,
    userName: string,
  ): Promise<partialUser | null> {
    let result: partialUser | null = null;

    try {
      result = await this.userQueries.getUserByCredentials(password, userName);
    } catch (err) {
      console.error(err);
    }

    return result;
  }

  //if user exists log them in - initialize state
  connectUser(user: partialUser): void {
    if (user) {
      this.authService.logIn(user);
      localStorage.setItem('connectedUser', JSON.stringify(user));
      this.router.navigate(['']);
    }
  }

  async signUp(password: string, userName: string): Promise<void> {
    const newUser = await this.userQueries.insertUser(password, userName);
    if (newUser) {
      this.connectUser(newUser);
    }
  }

  logOut(): void {
    this.authService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

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
     const searchesUserName = await firstValueFrom(
      this.userQueries.getUserByName(name),
    );
 
    return searchesUserName? true : false
  }

  // get user from db with password and user name
  async getUserByCredentials(
    password: string,
    userName: string,
  ): Promise<partialUser | null> {
    try {
      const user$ = this.userQueries.getUserBycredentials(password, userName); // Observable<User>
      const user = await firstValueFrom(user$);
      return user;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  //if user exists log them in - initialize state
  connectUser(user: partialUser): void {
    if (!user) {
    } else {
      this.authService.logIn(user);
      localStorage.setItem('connectedUser', JSON.stringify(user));
      this.router.navigate(['']);
    }
  }

  async signUp(password: string, userName: string): Promise<void> {
    const newUser = await firstValueFrom(
      this.userQueries.insertUser(password, userName),
    );
    if (!newUser) {
      console.error('somthing went wrong');
    } else {
      this.connectUser(newUser);
    }
  }

  logOut(): void {
    this.authService.logOut();
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
